<?php

declare(strict_types=1);

session_name('voshod_cms');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    route_request();
} catch (Throwable $exception) {
    json_response([
        'ok' => false,
        'message' => 'Server error',
        'debug' => app_debug() ? $exception->getMessage() : null,
    ], 500);
}

function route_request(): void
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $route = trim(preg_replace('#^/api/?#', '', $uri), '/');
    $route = $route === '' ? 'health' : $route;

    if ($route === 'health' && $method === 'GET') {
        json_response(['ok' => true, 'service' => 'voshod-cms-api']);
    }

    if ($route === 'login' && $method === 'POST') {
        login();
    }

    if ($route === 'logout' && $method === 'POST') {
        logout();
    }

    if ($route === 'me' && $method === 'GET') {
        current_user_response();
    }

    if ($route === 'cms' && $method === 'GET') {
        json_response(['ok' => true, 'data' => load_cms_data()]);
    }

    if ($route === 'cms' && $method === 'POST') {
        require_admin();
        $input = request_json();
        $data = $input['data'] ?? null;
        if (!is_array($data)) {
            json_response(['ok' => false, 'message' => 'Invalid CMS payload'], 422);
        }
        save_cms_data($data);
        json_response(['ok' => true, 'data' => load_cms_data()]);
    }

    if ($route === 'media' && $method === 'POST') {
        require_admin();
        upload_media();
    }

    if ($route === 'leads' && $method === 'POST') {
        create_lead();
    }

    if ($route === 'leads' && $method === 'GET') {
        require_admin();
        list_leads();
    }

    json_response(['ok' => false, 'message' => 'Route not found'], 404);
}

function app_config(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }

    $configFile = __DIR__ . '/config.php';
    if (!is_file($configFile)) {
        $configFile = __DIR__ . '/config.example.php';
    }

    $config = require $configFile;
    return is_array($config) ? $config : [];
}

function app_debug(): bool
{
    return (bool)($_ENV['APP_DEBUG'] ?? false);
}

function database(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $db = app_config()['db'] ?? [];
    $charset = $db['charset'] ?? 'utf8mb4';
    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', $db['host'] ?? 'localhost', $db['name'] ?? '', $charset);
    $pdo = new PDO($dsn, $db['user'] ?? '', $db['password'] ?? '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function request_json(): array
{
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') {
        return $_POST ?: [];
    }

    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function clean_string(mixed $value, int $maxLength = 500): string
{
    $value = trim((string)$value);
    $value = preg_replace('/\s+/u', ' ', $value) ?? $value;
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength);
    }
    return substr($value, 0, $maxLength);
}

function json_encode_field(mixed $value): string
{
    return json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: '{}';
}

function normalize_slug(string $slug): string
{
    $slug = trim($slug);
    if ($slug === '') {
        return '/';
    }
    return $slug[0] === '/' ? $slug : '/' . $slug;
}

function current_user(): ?array
{
    $userId = (int)($_SESSION['admin_user_id'] ?? 0);
    if ($userId <= 0) {
        return null;
    }

    $statement = database()->prepare('SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1');
    $statement->execute([$userId]);
    $user = $statement->fetch();
    return $user ?: null;
}

function require_admin(): array
{
    $user = current_user();
    if (!$user) {
        json_response(['ok' => false, 'message' => 'Unauthorized'], 401);
    }
    return $user;
}

function login(): void
{
    $input = request_json();
    $login = strtolower(clean_string($input['login'] ?? '', 190));
    $password = (string)($input['password'] ?? '');

    if ($login === 'admin') {
        $login = 'admin@site.local';
    }

    $statement = database()->prepare('SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1');
    $statement->execute([$login]);
    $user = $statement->fetch();

    if (!$user || !verify_password($password, (string)$user['password_hash'])) {
        json_response(['ok' => false, 'message' => 'Invalid login or password'], 401);
    }

    if (substr((string)$user['password_hash'], 0, 7) === 'sha256$') {
        $newHash = password_hash($password, PASSWORD_DEFAULT);
        $update = database()->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
        $update->execute([$newHash, $user['id']]);
    }

    $_SESSION['admin_user_id'] = (int)$user['id'];
    json_response([
        'ok' => true,
        'user' => [
            'id' => (int)$user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
        ],
    ]);
}

function verify_password(string $password, string $storedHash): bool
{
    if (substr($storedHash, 0, 7) === 'sha256$') {
        return hash_equals(substr($storedHash, 7), hash('sha256', $password));
    }
    return password_verify($password, $storedHash);
}

function logout(): void
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'] ?? '', (bool)$params['secure'], (bool)$params['httponly']);
    }
    session_destroy();
    json_response(['ok' => true]);
}

function current_user_response(): void
{
    $user = current_user();
    json_response(['ok' => true, 'user' => $user]);
}

function load_cms_data(): ?array
{
    $statement = database()->query(
        'SELECT s.id AS site_id, s.site_key, s.name AS site_name, s.domain, p.id AS page_id, p.page_key, p.title, p.slug, p.seo_title, p.seo_description, p.is_active
         FROM pages p
         INNER JOIN sites s ON s.id = p.site_id
         ORDER BY p.id ASC
         LIMIT 1'
    );
    $page = $statement->fetch();
    if (!$page) {
        return null;
    }

    $blockStatement = database()->prepare(
        'SELECT block_key, type, title, sort_order, is_active, content_json, settings_json
         FROM blocks
         WHERE page_id = ?
         ORDER BY sort_order ASC, id ASC'
    );
    $blockStatement->execute([$page['page_id']]);
    $blocks = [];

    foreach ($blockStatement->fetchAll() as $block) {
        $blocks[] = [
            'id' => $block['block_key'],
            'pageId' => $page['page_key'],
            'type' => $block['type'],
            'title' => $block['title'],
            'sortOrder' => (int)$block['sort_order'],
            'isActive' => (bool)$block['is_active'],
            'content' => json_decode((string)$block['content_json'], true) ?: [],
            'settings' => json_decode((string)$block['settings_json'], true) ?: [],
        ];
    }

    return [
        'site' => [
            'id' => $page['site_key'],
            'name' => $page['site_name'],
            'domain' => $page['domain'],
        ],
        'page' => [
            'id' => $page['page_key'],
            'siteId' => $page['site_key'],
            'title' => $page['title'],
            'slug' => $page['slug'],
            'seoTitle' => $page['seo_title'],
            'seoDescription' => $page['seo_description'],
            'isActive' => (bool)$page['is_active'],
            'blocks' => $blocks,
        ],
        'posts' => load_posts((int)$page['site_id']),
    ];
}

function save_cms_data(array $data): void
{
    $site = $data['site'] ?? [];
    $page = $data['page'] ?? [];
    $blocks = $page['blocks'] ?? [];
    $posts = $data['posts'] ?? [];

    if (!is_array($site) || !is_array($page) || !is_array($blocks) || !is_array($posts)) {
        json_response(['ok' => false, 'message' => 'Invalid CMS data'], 422);
    }

    $pdo = database();
    $pdo->beginTransaction();

    try {
        $siteKey = clean_string($site['id'] ?? 'site-main', 80) ?: 'site-main';
        $pageKey = clean_string($page['id'] ?? 'home', 80) ?: 'home';

        $statement = $pdo->prepare(
            'INSERT INTO sites (site_key, name, domain)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE name = VALUES(name), domain = VALUES(domain), updated_at = CURRENT_TIMESTAMP'
        );
        $statement->execute([
            $siteKey,
            clean_string($site['name'] ?? 'Site', 190),
            clean_string($site['domain'] ?? '', 190),
        ]);

        $statement = $pdo->prepare('SELECT id FROM sites WHERE site_key = ? LIMIT 1');
        $statement->execute([$siteKey]);
        $siteId = (int)$statement->fetchColumn();

        $statement = $pdo->prepare(
            'INSERT INTO pages (site_id, page_key, title, slug, seo_title, seo_description, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                site_id = VALUES(site_id),
                title = VALUES(title),
                slug = VALUES(slug),
                seo_title = VALUES(seo_title),
                seo_description = VALUES(seo_description),
                is_active = VALUES(is_active),
                updated_at = CURRENT_TIMESTAMP'
        );
        $statement->execute([
            $siteId,
            $pageKey,
            clean_string($page['title'] ?? 'Page', 190),
            normalize_slug((string)($page['slug'] ?? '/')),
            clean_string($page['seoTitle'] ?? '', 255),
            (string)($page['seoDescription'] ?? ''),
            !empty($page['isActive']) ? 1 : 0,
        ]);

        $statement = $pdo->prepare('SELECT id FROM pages WHERE page_key = ? LIMIT 1');
        $statement->execute([$pageKey]);
        $pageId = (int)$statement->fetchColumn();
        $savedBlockKeys = [];

        foreach ($blocks as $index => $block) {
            if (!is_array($block)) {
                continue;
            }

            $blockKey = clean_string($block['id'] ?? ('block-' . $index), 80);
            if ($blockKey === '') {
                continue;
            }

            $contentJson = json_encode_field($block['content'] ?? []);
            $settingsJson = json_encode_field($block['settings'] ?? []);
            $title = clean_string($block['title'] ?? $blockKey, 190);
            $type = clean_string($block['type'] ?? 'custom', 80);
            $sortOrder = (int)($block['sortOrder'] ?? (($index + 1) * 10));
            $isActive = !empty($block['isActive']) ? 1 : 0;

            $existing = find_block($pdo, $blockKey);
            if ($existing && block_changed($existing, $title, $contentJson, $settingsJson)) {
                $revision = $pdo->prepare(
                    'INSERT INTO block_revisions (block_id, title, content_json, settings_json, created_by)
                     VALUES (?, ?, ?, ?, ?)'
                );
                $revision->execute([
                    $existing['id'],
                    $existing['title'],
                    $existing['content_json'],
                    $existing['settings_json'],
                    $_SESSION['admin_user_id'] ?? null,
                ]);
            }

            $statement = $pdo->prepare(
                'INSERT INTO blocks (page_id, block_key, type, title, sort_order, is_active, content_json, settings_json)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                    page_id = VALUES(page_id),
                    type = VALUES(type),
                    title = VALUES(title),
                    sort_order = VALUES(sort_order),
                    is_active = VALUES(is_active),
                    content_json = VALUES(content_json),
                    settings_json = VALUES(settings_json),
                    updated_at = CURRENT_TIMESTAMP'
            );
            $statement->execute([$pageId, $blockKey, $type, $title, $sortOrder, $isActive, $contentJson, $settingsJson]);
            $savedBlockKeys[] = $blockKey;
        }

        if ($savedBlockKeys) {
            $placeholders = implode(',', array_fill(0, count($savedBlockKeys), '?'));
            $delete = $pdo->prepare("DELETE FROM blocks WHERE page_id = ? AND block_key NOT IN ($placeholders)");
            $delete->execute(array_merge([$pageId], $savedBlockKeys));
        }

        save_posts($pdo, $siteId, $posts);

        $pdo->commit();
    } catch (Throwable $exception) {
        $pdo->rollBack();
        throw $exception;
    }
}

function find_block(PDO $pdo, string $blockKey): ?array
{
    $statement = $pdo->prepare('SELECT * FROM blocks WHERE block_key = ? LIMIT 1');
    $statement->execute([$blockKey]);
    $block = $statement->fetch();
    return $block ?: null;
}

function load_posts(int $siteId): array
{
    try {
        $statement = database()->prepare(
            'SELECT post_key, title, description, cover_image, author_name, author_image, seo_keywords, is_published, sort_order, published_at, edited_at, content_json
             FROM posts
             WHERE site_id = ?
             ORDER BY sort_order ASC, id ASC'
        );
        $statement->execute([$siteId]);
    } catch (Throwable $exception) {
        return [];
    }

    $posts = [];
    foreach ($statement->fetchAll() as $post) {
        $posts[] = [
            'id' => $post['post_key'],
            'title' => $post['title'],
            'description' => $post['description'] ?? '',
            'coverImage' => $post['cover_image'] ?? '',
            'authorName' => $post['author_name'] ?? '',
            'authorImage' => $post['author_image'] ?? '',
            'seoKeywords' => $post['seo_keywords'] ?? '',
            'isPublished' => (bool)$post['is_published'],
            'sortOrder' => (int)$post['sort_order'],
            'publishedAt' => $post['published_at'] ?? '',
            'updatedAt' => $post['edited_at'] ?? '',
            'body' => json_decode((string)$post['content_json'], true) ?: [],
        ];
    }
    return $posts;
}

function save_posts(PDO $pdo, int $siteId, array $posts): void
{
    $savedPostKeys = [];

    foreach ($posts as $index => $post) {
        if (!is_array($post)) {
            continue;
        }

        $postKey = clean_string($post['id'] ?? ('post-' . $index), 120);
        if ($postKey === '') {
            continue;
        }

        $statement = $pdo->prepare(
            'INSERT INTO posts (site_id, post_key, title, description, cover_image, author_name, author_image, seo_keywords, is_published, sort_order, published_at, edited_at, content_json)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                site_id = VALUES(site_id),
                title = VALUES(title),
                description = VALUES(description),
                cover_image = VALUES(cover_image),
                author_name = VALUES(author_name),
                author_image = VALUES(author_image),
                seo_keywords = VALUES(seo_keywords),
                is_published = VALUES(is_published),
                sort_order = VALUES(sort_order),
                published_at = VALUES(published_at),
                edited_at = VALUES(edited_at),
                content_json = VALUES(content_json),
                updated_at = CURRENT_TIMESTAMP'
        );
        $statement->execute([
            $siteId,
            $postKey,
            clean_string($post['title'] ?? 'Post', 255),
            (string)($post['description'] ?? ''),
            clean_string($post['coverImage'] ?? '', 255),
            clean_string($post['authorName'] ?? '', 190),
            clean_string($post['authorImage'] ?? '', 255),
            (string)($post['seoKeywords'] ?? ''),
            !empty($post['isPublished']) ? 1 : 0,
            (int)($post['sortOrder'] ?? (($index + 1) * 10)),
            clean_string($post['publishedAt'] ?? '', 40),
            clean_string($post['updatedAt'] ?? '', 40),
            json_encode_field($post['body'] ?? []),
        ]);
        $savedPostKeys[] = $postKey;
    }

    if ($savedPostKeys) {
        $placeholders = implode(',', array_fill(0, count($savedPostKeys), '?'));
        $delete = $pdo->prepare("DELETE FROM posts WHERE site_id = ? AND post_key NOT IN ($placeholders)");
        $delete->execute(array_merge([$siteId], $savedPostKeys));
    } else {
        $delete = $pdo->prepare('DELETE FROM posts WHERE site_id = ?');
        $delete->execute([$siteId]);
    }
}

function block_changed(array $block, string $title, string $contentJson, string $settingsJson): bool
{
    return $block['title'] !== $title
        || $block['content_json'] !== $contentJson
        || $block['settings_json'] !== $settingsJson;
}

function upload_media(): void
{
    if (empty($_FILES['image']) || !is_array($_FILES['image'])) {
        json_response(['ok' => false, 'message' => 'Image is required'], 422);
    }

    $file = $_FILES['image'];
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        json_response(['ok' => false, 'message' => 'Upload failed'], 422);
    }

    $config = app_config()['uploads'] ?? [];
    $maxSize = (int)($config['max_size'] ?? (5 * 1024 * 1024));
    if ((int)$file['size'] > $maxSize) {
        json_response(['ok' => false, 'message' => 'File is too large'], 422);
    }

    $mimeType = detect_mime_type((string)$file['tmp_name']);
    $allowed = $config['allowed_types'] ?? [];
    if (!isset($allowed[$mimeType])) {
        json_response(['ok' => false, 'message' => 'Unsupported image type'], 422);
    }

    $relativeDir = date('Y/m');
    $targetDir = __DIR__ . '/../uploads/' . $relativeDir;
    if (!is_dir($targetDir) && !mkdir($targetDir, 0775, true) && !is_dir($targetDir)) {
        json_response(['ok' => false, 'message' => 'Cannot create upload directory'], 500);
    }

    $extension = $allowed[$mimeType];
    $filename = date('YmdHis') . '-' . bin2hex(random_bytes(8)) . '.' . $extension;
    $targetPath = $targetDir . '/' . $filename;

    if (!move_uploaded_file((string)$file['tmp_name'], $targetPath)) {
        json_response(['ok' => false, 'message' => 'Cannot save image'], 500);
    }

    $publicPath = '/uploads/' . $relativeDir . '/' . $filename;
    $statement = database()->prepare(
        'INSERT INTO media (path, original_name, mime_type, size_bytes, uploaded_by)
         VALUES (?, ?, ?, ?, ?)'
    );
    $statement->execute([
        $publicPath,
        clean_string($file['name'] ?? $filename, 255),
        $mimeType,
        (int)$file['size'],
        $_SESSION['admin_user_id'] ?? null,
    ]);

    json_response(['ok' => true, 'path' => $publicPath]);
}

function detect_mime_type(string $path): string
{
    if (function_exists('finfo_open')) {
        $info = finfo_open(FILEINFO_MIME_TYPE);
        if ($info) {
            $mimeType = finfo_file($info, $path);
            finfo_close($info);
            if (is_string($mimeType) && $mimeType !== '') {
                return $mimeType;
            }
        }
    }

    return mime_content_type($path) ?: 'application/octet-stream';
}

function create_lead(): void
{
    $input = request_json();
    $name = clean_string($input['name'] ?? '', 190);
    $contact = clean_string($input['contact'] ?? ($input['phone'] ?? ''), 190);
    $message = trim((string)($input['message'] ?? ''));
    $source = clean_string($input['source'] ?? 'site', 80) ?: 'site';
    $fields = $input['fields'] ?? null;

    if ($contact === '') {
        json_response(['ok' => false, 'message' => 'Contact is required'], 422);
    }

    $statement = database()->prepare(
        'INSERT INTO leads (name, contact, message, source, fields_json, ip, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $statement->execute([
        $name ?: null,
        $contact,
        $message ?: null,
        $source,
        $fields === null ? null : json_encode_field($fields),
        $_SERVER['REMOTE_ADDR'] ?? null,
        clean_string($_SERVER['HTTP_USER_AGENT'] ?? '', 500),
    ]);

    $leadId = (int)database()->lastInsertId();
    $lead = get_lead($leadId);
    send_lead_email($lead);

    json_response(['ok' => true, 'lead' => $lead]);
}

function get_lead(int $leadId): array
{
    $statement = database()->prepare('SELECT * FROM leads WHERE id = ? LIMIT 1');
    $statement->execute([$leadId]);
    return normalize_lead($statement->fetch() ?: []);
}

function list_leads(): void
{
    $statement = database()->query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 200');
    $leads = array_map('normalize_lead', $statement->fetchAll());
    json_response(['ok' => true, 'leads' => $leads]);
}

function normalize_lead(array $lead): array
{
    return [
        'id' => (int)($lead['id'] ?? 0),
        'name' => $lead['name'] ?? '',
        'contact' => $lead['contact'] ?? '',
        'message' => $lead['message'] ?? '',
        'source' => $lead['source'] ?? 'site',
        'status' => $lead['status'] ?? 'new',
        'fields' => !empty($lead['fields_json']) ? (json_decode((string)$lead['fields_json'], true) ?: []) : [],
        'createdAt' => $lead['created_at'] ?? '',
    ];
}

function send_lead_email(array $lead): bool
{
    $notifications = app_config()['notifications'] ?? [];
    $to = trim((string)($notifications['to_email'] ?? ''));
    if ($to === '' || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    $from = trim((string)($notifications['from_email'] ?? 'noreply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost')));
    if (!filter_var($from, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    $subject = 'Новая заявка с сайта АН Шоколад';
    $fields = $lead['fields'] ? json_encode($lead['fields'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) : '-';
    $body = implode("\n", [
        'Новая заявка с сайта АН Шоколад',
        '',
        'Имя: ' . ($lead['name'] ?: '-'),
        'Контакт: ' . $lead['contact'],
        'Сообщение: ' . ($lead['message'] ?: '-'),
        'Источник: ' . $lead['source'],
        'Поля: ' . $fields,
        'Создана: ' . $lead['createdAt'],
    ]);

    if (($notifications['transport'] ?? 'mail') === 'smtp') {
        return send_smtp_email($notifications, $to, $from, $subject, $body);
    }

    $headers = implode("\r\n", [
        'From: ' . $from,
        'Reply-To: ' . $from,
        'Content-Type: text/plain; charset=UTF-8',
    ]);

    return @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers);
}

/**
 * Sends mail directly through an authenticated SMTP server without a Composer dependency.
 * It supports implicit SSL (port 465) and STARTTLS (usually port 587).
 */
function send_smtp_email(array $notifications, string $to, string $from, string $subject, string $body): bool
{
    $smtp = $notifications['smtp'] ?? [];
    $host = trim((string)($smtp['host'] ?? ''));
    $port = (int)($smtp['port'] ?? 465);
    $encryption = strtolower(trim((string)($smtp['encryption'] ?? 'ssl')));
    $username = trim((string)($smtp['username'] ?? ''));
    $password = (string)($smtp['password'] ?? '');
    $timeout = max(5, min(30, (int)($smtp['timeout'] ?? 15)));

    if ($host === '' || $port < 1 || $port > 65535 || $username === '' || $password === '') {
        error_log('АН Шоколад SMTP: missing configuration.');
        return false;
    }

    $connectionHost = $encryption === 'ssl' ? 'ssl://' . $host : $host;
    $socket = @stream_socket_client(
        $connectionHost . ':' . $port,
        $errorNumber,
        $errorMessage,
        $timeout,
        STREAM_CLIENT_CONNECT
    );

    if (!is_resource($socket)) {
        error_log('АН Шоколад SMTP: connection failed (' . $errorNumber . ').');
        return false;
    }

    stream_set_timeout($socket, $timeout);

    try {
        smtp_expect($socket, [220]);
        $clientName = preg_replace('/[^A-Za-z0-9.-]/', '', $_SERVER['HTTP_HOST'] ?? 'localhost') ?: 'localhost';
        smtp_command($socket, 'EHLO ' . $clientName, [250]);

        if ($encryption === 'tls' || $encryption === 'starttls') {
            smtp_command($socket, 'STARTTLS', [220]);
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException('Cannot enable SMTP TLS.');
            }
            smtp_command($socket, 'EHLO ' . $clientName, [250]);
        }

        smtp_command($socket, 'AUTH LOGIN', [334]);
        smtp_command($socket, base64_encode($username), [334]);
        smtp_command($socket, base64_encode($password), [235]);
        smtp_command($socket, 'MAIL FROM:<' . $from . '>', [250]);
        smtp_command($socket, 'RCPT TO:<' . $to . '>', [250, 251]);
        smtp_command($socket, 'DATA', [354]);

        $fromName = smtp_header_value((string)($notifications['from_name'] ?? 'АН Шоколад'));
        $headers = [
            'From: ' . smtp_encode_header($fromName) . ' <' . $from . '>',
            'Reply-To: ' . $from,
            'To: ' . $to,
            'Subject: ' . smtp_encode_header($subject),
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
        ];
        $message = implode("\r\n", $headers) . "\r\n\r\n" . smtp_escape_body($body) . "\r\n.\r\n";
        smtp_write($socket, $message);
        smtp_expect($socket, [250]);
        smtp_write($socket, "QUIT\r\n");
        fclose($socket);
        return true;
    } catch (Throwable $exception) {
        error_log('АН Шоколад SMTP: ' . $exception->getMessage());
        if (is_resource($socket)) {
            @fclose($socket);
        }
        return false;
    }
}

function smtp_command($socket, string $command, array $expectedCodes): void
{
    smtp_write($socket, $command . "\r\n");
    smtp_expect($socket, $expectedCodes);
}

function smtp_write($socket, string $message): void
{
    $written = fwrite($socket, $message);
    if ($written === false || $written !== strlen($message)) {
        throw new RuntimeException('SMTP write failed.');
    }
}

function smtp_expect($socket, array $expectedCodes): void
{
    $response = '';
    do {
        $line = fgets($socket, 2048);
        if ($line === false) {
            throw new RuntimeException('SMTP server did not respond.');
        }
        $response .= $line;
    } while (preg_match('/^\d{3}-/', $line));

    $code = (int)substr($response, 0, 3);
    if (!in_array($code, $expectedCodes, true)) {
        throw new RuntimeException('SMTP response ' . $code . '.');
    }
}

function smtp_header_value(string $value): string
{
    return trim(str_replace(["\r", "\n"], '', $value));
}

function smtp_encode_header(string $value): string
{
    $value = smtp_header_value($value);
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function smtp_escape_body(string $body): string
{
    $normalized = str_replace(["\r\n", "\r"], "\n", $body);
    return str_replace("\n.", "\n..", str_replace("\n", "\r\n", $normalized));
}

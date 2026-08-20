<?php

return [
    'db' => [
        'host' => 'localhost',
        'name' => 'timeweb_database_name',
        'user' => 'timeweb_database_user',
        'password' => 'timeweb_database_password',
        'charset' => 'utf8mb4',
    ],
    'notifications' => [
        'to_email' => 'info@example.com',
        'from_email' => 'noreply@your-domain.ru',
        'from_name' => 'Новый дом. Новая жизнь.',
        // Use "smtp" for reliable delivery through a mailbox provider.
        // Keep real credentials only in api/config.php on the server.
        'transport' => 'smtp',
        'smtp' => [
            'host' => 'smtp.mail.ru',
            'port' => 465,
            'encryption' => 'ssl',
            'username' => 'info@example.com',
            'password' => 'mailru_app_password',
            'timeout' => 15,
        ],
    ],
    'uploads' => [
        'max_size' => 5 * 1024 * 1024,
        'allowed_types' => [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
        ],
    ],
];

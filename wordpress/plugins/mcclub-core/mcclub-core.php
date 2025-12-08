<?php
/**
 * Plugin Name: MCClub Core
 * Description: Funcionalidades core para el sitio del Club Malacca - CPT Eventos e Inscripciones
 * Version: 1.0.0
 * Author: CBM Malacca Club
 * Text Domain: mcclub
 * License: GPL-2.0-or-later
 */

if (!defined('ABSPATH')) {
    exit;
}

define('MCCLUB_VERSION', '1.0.0');
define('MCCLUB_PATH', plugin_dir_path(__FILE__));
define('MCCLUB_URL', plugin_dir_url(__FILE__));

// Cargar clases
require_once MCCLUB_PATH . 'includes/class-cpt-eventos.php';
require_once MCCLUB_PATH . 'includes/class-cpt-inscripciones.php';
require_once MCCLUB_PATH . 'includes/class-meta-boxes.php';
require_once MCCLUB_PATH . 'includes/class-rest-api.php';

/**
 * Inicializar plugin
 */
function mcclub_init() {
    new MCClub_CPT_Eventos();
    new MCClub_CPT_Inscripciones();
    new MCClub_Meta_Boxes();
    new MCClub_REST_API();
}
add_action('plugins_loaded', 'mcclub_init');

/**
 * Activacion del plugin
 */
function mcclub_activate() {
    mcclub_init();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'mcclub_activate');

/**
 * Desactivacion del plugin
 */
function mcclub_deactivate() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'mcclub_deactivate');

/**
 * Habilitar CORS para la REST API
 */
function mcclub_cors_headers() {
    // Permitir localhost en desarrollo
    $allowed_origins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://cbmmalacca.freemem.space'
    ];

    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce, X-Requested-With");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Max-Age: 86400");
    }

    // Manejar preflight OPTIONS
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit();
    }
}
add_action('init', 'mcclub_cors_headers', 1);

/**
 * Asegurar CORS en respuestas REST
 */
function mcclub_rest_cors($response) {
    $allowed_origins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://cbmmalacca.freemem.space'
    ];

    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

    if (in_array($origin, $allowed_origins)) {
        $response->header('Access-Control-Allow-Origin', $origin);
        $response->header('Access-Control-Allow-Credentials', 'true');
    }

    return $response;
}
add_filter('rest_post_dispatch', 'mcclub_rest_cors', 10, 1);

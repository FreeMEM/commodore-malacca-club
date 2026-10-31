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

/**
 * Sin listado de usuarios para quien no ha iniciado sesion: /wp-json/wp/v2/users
 * daba a cualquiera los nombres de cuenta de los administradores (31/10/2026).
 * El frontend no los usa: de cada noticia solo pinta la imagen destacada.
 */
function mcclub_ocultar_usuarios($endpoints) {
    if (is_user_logged_in()) {
        return $endpoints;
    }
    unset($endpoints['/wp/v2/users'], $endpoints['/wp/v2/users/(?P<id>[\d]+)']);
    return $endpoints;
}
add_filter('rest_endpoints', 'mcclub_ocultar_usuarios');

/**
 * Salud del sitio: las actualizaciones automaticas estan apagadas a proposito
 * (DISALLOW_FILE_MODS en docker-compose.yml); las hace cada dia el mantenimiento
 * del CT 105 con WP-CLI.
 */
function mcclub_sin_prueba_actualizaciones($pruebas) {
    unset($pruebas['async']['background_updates']);
    return $pruebas;
}
add_filter('site_status_tests', 'mcclub_sin_prueba_actualizaciones');

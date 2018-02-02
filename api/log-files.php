<?php

const LOG_FILE_PATH = '/mnt/internal_storage/log/';

function url($path='', $is_api=true) {
	$scheme = 'http';
	if (isset($_SERVER['REQUEST_SCHEME'])) {
		$scheme = $_SERVER['REQUEST_SCHEME'];
	}

	$base_path = '';
	if ($is_api) {
		$base_path = '/api/';
	}

	return $scheme . '://' . $_SERVER['HTTP_HOST'] . $base_path . $path;
}

function get_filesize($file) {
	$size = filesize($file);
	if ($size < 1024) {
		$size .= " B";
	} else if (($size < 1048576) && ($size > 1023)) {
		$size = round($size/1024, 1) . " Kb";
	} else if (($size < 1073741824) && ($size > 1048575)) {
		$size = round($size/1048576, 1) . " Mb";
	} else {
		$size = round($size/1073741824, 1) . " Gb";
	}
	return $size;
}

$log_files = [];

// Check if directory exists
if (is_dir(LOG_FILE_PATH)) {
    // Open the directory
    if ($dh = opendir(LOG_FILE_PATH)) {
        // Loop until all files are read
        while (($file = readdir($dh))) {
            // Get the extension
            $ext = pathinfo($file, PATHINFO_EXTENSION);
            // Check that its a log file
            if ($ext == 'log') {
                // Create the full path
                $file_w_path = LOG_FILE_PATH . '/' . $file;
                // Create the download path
                $download_path = url('/logs/' . $file, false);
                // Build out file meta
                $log_files[] = [
                    'raw_name'          =>  $file,
                    'size_display'      =>  get_filesize($file_w_path),
                    'size_actual'       =>  filesize($file_w_path),
                    'date_modified_raw' =>  filemtime($file_w_path),
                    'date_modified'     =>  date("M j Y g:i A", filemtime($file_w_path)),
                    'download_path'     =>  $download_path
                ];
            }
        }

        closedir($dh);
        // Sort by actual date
        usort($log_files, function($a, $b) {
            return $b['date_modified_raw'] - $a['date_modified_raw'];
        });
    }
}

header('Access-Control-Allow-Origin: *');
header('Content: application/json');
echo json_encode(['files' => $log_files]);
<?php
  require 'vendor/autoload.php';

  use Aws\S3\S3Client;
  use Aws\S3\Exception\S3Exception;

  // Instantiate an S3 client
  // $s3 = S3Client::factory(array(
  //   'key'    => '',
  //   'secret' => '',
  // ));

  $allowedExts = array("gif", "jpeg", "jpg", "png", "GIF", "JPEG", "JPG", "PNG");
  $temp = explode(".", $_FILES["img"]["name"]);
  $extension = end($temp);
  $imagePath = "tmp/";

  if ( in_array($extension, $allowedExts)) {
    if ($_FILES["img"]["error"] > 0) {
      $response = array(
        "status" => 'error',
        "message" => 'ERROR Return Code: '. $_FILES["img"]["error"],
      );
    } else {       
      $filename = $_FILES["img"]["tmp_name"];
      list($width, $height) = getimagesize( $filename );
      
      $length = 16;
      $path = '';

      if (! ini_get('date.timezone')) {
        date_default_timezone_set('GMT');
      }

      $randomString = substr(str_shuffle(md5(time())), 0, $length).date("Ymd");

      for($i = 0; $i < 4; $i++) {
        $path .= substr($randomString, 0, 1).'/';
        $randomString = substr($randomString, 1, strlen($randomString));
      }
      $path = "avater/" . $path . $randomString . '.' . $extension;

      move_uploaded_file($filename, $imagePath . $_FILES["img"]["name"]);
      $response = array(
      "status" => 'success',
      "url" => $imagePath.$_FILES["img"]["name"],
      "width" => $width,
      "height" => $height
      );
      // try {
      //   $s3->putObject(array(
      //     'Bucket' => '',
      //     'Key'    => $path,
      //     'Body'   => fopen($filename, 'r'),
      //     'ACL'    => 'public-read',
      //   ));
      //   $response = array(
      //     "status" => 'success',
      //     "url" => "".$path,
      //     "width" => $width,
      //     "height" => $height
      //   );
      // } catch (S3Exception $e) {
      //   $response = array(
      //     "status" => 'error',
      //     "message" => 'There was an error uploading the file.',
      //   );
      // }
    }
  } else {
    $response = array(
      "status" => 'error',
      "message" => 'something went wrong',
    );
  }
  print json_encode($response);
?>
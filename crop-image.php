<?php
  require 'vendor/autoload.php';
  
  use Aws\S3\S3Client;
  use Aws\S3\Exception\S3Exception;

  // Instantiate an S3 client
  // $s3 = S3Client::factory(array(
  //   'key'    => '',
  //   'secret' => '',
  // ));

  $imgUrl = $_POST['imgUrl'];
  $imgInitW = $_POST['imgInitW'];
  $imgInitH = $_POST['imgInitH'];
  $imgW = $_POST['imgW'];
  $imgH = $_POST['imgH'];
  $imgY1 = $_POST['imgY1'];
  $imgX1 = $_POST['imgX1'];
  $cropW = $_POST['cropW'];
  $cropH = $_POST['cropH'];

  $jpeg_quality = 100;

  $output_filename = "tmp/croppedImg_".rand();

  switch(strtolower(getimagesize($imgUrl)['mime'])) {
    case 'image/png':
      $img_r = imagecreatefrompng($imgUrl);
      $source_image = imagecreatefrompng($imgUrl);
      $type = '.png';
      break;
    case 'image/jpeg':
      $img_r = imagecreatefromjpeg($imgUrl);
      $source_image = imagecreatefromjpeg($imgUrl);
      $type = '.jpeg';
      break;
    case 'image/gif':
      $img_r = imagecreatefromgif($imgUrl);
      $source_image = imagecreatefromgif($imgUrl);
      $type = '.gif';
      break;
    default: 
      $response = array(
        "status" => 'error',
        "message" => 'image type not supported.',
      );
      print json_encode($response);
      die();
  }
    
  $resizedImage = imagecreatetruecolor($imgW, $imgH);
  imagecopyresampled($resizedImage, $source_image, 0, 0, 0, 0, $imgW, $imgH, $imgInitW, $imgInitH);   
     
  $dest_image = imagecreatetruecolor($cropW, $cropH);
  imagecopyresampled($dest_image, $resizedImage, 0, 0, $imgX1, $imgY1, $cropW, $cropH, $cropW, $cropH);    

  imagejpeg($dest_image, $output_filename.$type, $jpeg_quality);

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
  $path = "avater/" . $path . $randomString . $type;
  $response = array(
    "status" => 'success',
    "url" => $output_filename.$type
  );
  // try {
  //   $s3->putObject(array(
  //     'Bucket' => '',
  //     'Key'    => $path,
  //     'Body'   => fopen($output_filename . $type, 'r'),
  //     'ACL'    => 'public-read',
  //   ));
  //   $response = array(
  //     "status" => 'success',
  //     "url" => "".$path
  //   );
  //   unlink($output_filename . $type);
  // } catch (S3Exception $e) {
  //   $response = array(
  //     "status" => 'error',
  //     "message" => 'There was an error uploading the file.',
  //   );
  //   unlink($output_filename . $type);
  // }
  print json_encode($response);

?>
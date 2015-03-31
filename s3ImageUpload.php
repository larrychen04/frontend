<html lang="en">
  <head>
    <link href="assets/css/croppic.css" rel="stylesheet">
  </head>
  <body>
    <div style="width:200px; height:200px;margin:auto">
        <h4 class="centered"> EYECANDY </h4>
        <div id="cropContainerEyecandy"></div>
    </div>
    <style>
        #cropContainerEyecandy{ width:100%; height:200px; position: relative; border:1px solid #ccc; overflow: hidden}
    </style>

    <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
    <script src="croppic.min.js"></script>
    <script>
        var croppicContainerEyecandyOptions = {
                uploadUrl:'save-image.php',
                cropUrl:'crop-image.php',
                imgEyecandy:true,
                loaderHtml:'<div class="loader bubblingG"><span id="bubblingG_1"></span><span id="bubblingG_2"></span><span id="bubblingG_3"></span></div> ',
                onBeforeImgUpload: function(){ 
                    var fileElement = $(this.form[0]).find('input[type=file]');
                    var image = fileElement[0].files[0];
                    if (image == undefined) {
                        throw new Error('This is not an error. This is just to abort javascript');
                    }

                    if (image.size/(1024*1024) > 2){
                        throw new Error('This is not an error. This is just to abort javascript');
                    }

                    if (image.type.toLowerCase() != 'image/jpeg' && image.type.toLowerCase() != 'image/gif' && image.type.toLowerCase() != 'image/png') {
                        throw new Error('This is not an error. This is just to abort javascript');
                    }
                }
        }
        var cropContainerEyecandy = new Croppic('cropContainerEyecandy', croppicContainerEyecandyOptions);
        
    </script>
  </body>
</html>

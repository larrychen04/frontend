<!DOCTYPE html>
<?php include('partials/head.phtml') ?>
    <body class="register">
        <header>
            <div class="container">
            </div>
        </header>
        <section>  
            <div class="container" >   
                <div class="row">
                    <form data-view-class="views/CreateAccount" class="mt-50">
                        <h2>
                            In a couple short steps, you will be a glorious unicorn<br/>
                            <span>and will roam free with other unicorn people.</span>
                        </h2>
                        <div class="row">
                            <div class="col-sm-12 col-md-4">
                                <label>
                                    <span class="label-num">01.</span>
                                    Email Address<br/>
                                    <small>A verification email will be sent to this address</small>
                                </label>
                            </div>
                            <div class="col-sm-6 col-md-4">
                                <input type="email" class="form-control email" placeholder="Enter Email Address" data-parsley-required="true">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12"><hr/></div>                           
                        </div>
                        <div data-view-class="views/Fields/Password">
                            <div class="row">
                                <div class="col-sm-12 col-md-4">
                                    <label>
                                        <span class="label-num">02.</span>
                                        Legal Name<br/>
                                        <small>Must be your actual name for tax purposes.</small>
                                    </label>
                                </div>
                                <div class="col-sm-6 col-md-4 form-group">
                                    <input type="text" class="form-control firstname" placeholder="First Name" data-parsley-required="true">
                                </div>
                                <div class="col-sm-6 col-md-4 form-group">
                                    <input type="text" class="form-control lastname" placeholder="Last Name" data-parsley-required="true">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12"><hr/></div>                           
                            </div>
                            <div class="row">
                                <div class="col-sm-12 col-md-4">
                                    <label>
                                        <span class="label-num">03.</span>
                                        Password<br/>
                                        <small>Your password must be at least 8 characters long and contain at least 1 letter and 1 number</small>
                                    </label>
                                </div>
                                <div class="col-md-4 col-sm-6 form-group">
                                    <input type="password" class="form-control password" placeholder="Enter Password" data-parsley-required="true">
                                </div>
                                <div class="col-md-4 col-sm-6 form-group">
                                    <input type="password" class="form-control confirmPassword" placeholder="Confirm Password">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12"><hr/></div>                           
                        </div>
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label>
                                        <span class="label-num">04.</span>
                                        Your Company<br/>
                                        <small>What is the name of your company?</small>
                                    </label>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <input type="text" class="form-control company-name" id="fieldID" placeholder="Company Name" data-parsley-required="true">
                                </div>
                            </div>
                            <div class="col-sm-4" data-view-class="views/OverlayTest">
                                <a class="overlay">Overlay test</a><br/>
                                <input class="overlay" placeholder="get value from overlay"/>
                                <div class="hide">
                                    <section class="overlay" data-view-class="views/overlay/Layer1">
                                        <h2>Overlay layer1</h2>  
                                        <input class="overlay-test"/><br/>
                                        <a class="updateValue"> update Value </a><br/>
                                        <a class="overlay">Overlay test</a>
                                        <div class="hide">
                                            <section class="overlay" data-view-class="views/overlay/Layer2">
                                                <h2>Overlay layer2</h2> 
                                            </section>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12"><hr/></div>                           
                        </div>
                        <div class="row">
                            <div class="col-md-4 mb-20">
                                <label>
                                    <span class="label-num mr-5">05.</span>
                                    <input type="checkbox" data-parsley-required="true" name="terms_condition"><a class="ml-5">I agree to the Terms and Conditions</a>
                                </label>
                            </div>
                            <div class="col-md-2 col-md-offset-6">
                                <button type="button" class="btn btn-primary btn-lg btn-block">Continue<i class="right"></i></button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
        <section style="height: 150px">

        </section>
        <footer>
            <div class="container">
                <div class="row">
                    <div class="col-xs-12">
                    </div>
                </div>
            </div>
        </footer>
    </body>
<?php include('partials/js.phtml') ?>
</html>
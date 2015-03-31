<!DOCTYPE html>
<?php include('partials/head.phtml') ?>
    <body class="test">
        <header>
            <div class="container">
                <div class="row">
                    <div class="col-xs-12">
                    </div>
                </div>
            </div>
        </header>
        <section>
            <div class="container">
                <div class="row">
                    <form>
                        <div class="col-xs-12 col-md-6 form-group">
                            <label class="col-xs-2">
                                Unit/Suite
                            </label>
                            <div class="col-xs-10">
                                <input type="text" class="form-control firstname" placeholder="First Name" data-parsley-required="true">
                            </div>
                        </div>

                        <div class="col-xs-12 col-md-6 form-group">
                            <label class="col-xs-2">
                                State
                            </label>
                            <div class="col-xs-10">
                                <input type="text" class="form-control firstname" placeholder="First Name" data-parsley-required="true">
                            </div>
                        </div>


                        <div class="col-xs-12 col-md-6 form-group">
                            <label class="col-xs-2">
                                Australia
                            </label>
                            <div class="col-xs-10">
                                <select class="form-control">
                                    <option>Australia</option>
                                    <option>China</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-xs-12 col-md-6 form-group">
                            <div class="col-xs-10 col-xs-push-2">
                                <label>
                                    <input type="radio"> Hide street address on listing
                                </label>
                            </div>
                        </div>
                        <hr/>
                        <div>
                            <div class="col-xs-12 col-md-offset-1 col-md-10">
                                <div class="container-fluid">
                                    <div class="row">
                                        <div class="col-md-4 col-xs-12 mb-10">
                                            <span class="glyphicon glyphicon-option-vertical" aria-hidden="true">
                                            </span>
                                            <select class="form-control">
                                                <option>1</option>
                                                <option>1</option>
                                                <option>1</option>
                                            </select>
                                        </div>
                                        <div class="col-md-4 mb-10 col-xs-12" >
                                            <span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true">
                                            </span>
                                            <select class="form-control" style="width:100px">
                                                <option>1</option>
                                                <option>1</option>
                                                <option>1</option>
                                            </select>                                            
                                        </div>

                                        <div class="col-md-4 col-xs-12 mb-10">
                                            <span class="glyphicon glyphicon-search" aria-hidden="true">
                                            </span>
                                            <select class="form-control">
                                                <option>1</option>
                                                <option>1</option>
                                                <option>1</option>
                                            </select>                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>      
    </body>
<?php include_once('partials/js.phtml') ?>
</html>

define([],function(){
    var _class = function(left,top,width,height){
        this.width = width || 0;
        this.height = height || 0;
        this.left = left || 0;
        this.top = top || 0;;
        return this;
    };
    _class.prototype.scale = function(scale,round){
        var clone = this.clone();
        // added this line for the very big images:
        //if(round){ scale = Math.floor(scale * 10) / 10; }
        clone.width *= scale;
        clone.height *= scale;
        clone.left *= scale;
        clone.top *= scale;
        if(round){
            clone.width = Math.round(clone.width);
            clone.height = Math.round(clone.height);
            clone.left = Math.round(clone.left);
            clone.top = Math.round(clone.top);
        }


        return clone;

    };
    _class.prototype.clone = function(){
        var clone = new _class(this.left,this.top,this.width,this.height);
        return clone;
    }

    _class.prototype.getScaleFromRectangle = function(bounds,maximal){
        var scale = 1;
        if(maximal){
            scale = Math.max(this.width / bounds.width,this.height / bounds.height);
        }
        else{
            scale = Math.min(this.width / bounds.width,this.height / bounds.height);
        }
        return scale;
    }

    _class.prototype.fitToBounds = function(bounds){
        var clone = this.clone();
        if(clone.inBounds(bounds)){
            return clone;
        }


        var dx1 = bounds.left - clone.left,dy1 = bounds.top  - clone.top;

        if(dx1 > 0){
            clone.left += dx1;
        }

        if(dy1 > 0){
            clone.top += dy1;
        }

        var nw1X = bounds.left,nw1Y = bounds.top, se1X = bounds.left + bounds.width,se1Y = bounds.top + bounds.height;
        var nw2X = clone.left,nw2Y = clone.top, se2X = clone.left + clone.width,se2Y = clone.top + clone.height;

        var dx2 = se2X - se1X,dy2 = se2Y - se1Y;

        if(dx2 > 0){
            clone.width -= dx2;
        }
        if(dy2 > 0){
            clone.height -= dy2;
        }


        return clone;
    }

    _class.prototype.inBounds = function(bounds){
        var nw1X = bounds.left,nw1Y = bounds.top, se1X = bounds.left + bounds.width,se1Y = bounds.top + bounds.height;
        var nw2X = this.left,nw2Y = this.top, se2X = this.left + this.width,se2Y = this.top + this.height;

        //console.log(nw2X ,nw1X,nw1Y,nw2Y,se2X,se1X,se2Y,se1Y);
        //console.log(nw2X >= nw1X,nw1Y >= nw2Y,se2X <= se1X,se2Y <= se1Y);
        return nw2X >= nw1X && nw2Y >= nw1Y && se2X <= se1X && se2Y <= se1Y;
    }

    return _class;
});
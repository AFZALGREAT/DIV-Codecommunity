const moment=require('moment');
module.exports={

    select:function(selected,options){
        return options.fn(this).replace(new RegExp('value=\"'+selected+'\"'),'$&selected="selected"');
    },
    
    generatetime:function(date,format){
        return moment(date).format(format);
    },
    ifEqual:function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    },
    substr:function(length, context, options) {
        if ( context.length > length ) {
         return context.substring(0, length) + "...";
        } else {
         return context;
        }}
    // String.prototype.trimEllip=function(length){
    //     return this.length>length?this.substring(0,length)+"....":this;
    // }


};
var utils = {
    getCurrentTime() {
        var currentdate = new Date(); 
        var currentDateTime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1)  + "/" 
            + currentdate.getFullYear() + " @ "  
            + currentdate.getHours() + ":"  
            + currentdate.getMinutes() + ":" 
            + currentdate.getSeconds();
    return currentDateTime;
    }
}   

export default utils
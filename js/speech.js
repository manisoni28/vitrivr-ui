if (annyang) {

  var errorMessage = false;

  var scrollTextBox = function(){
        var textarea = $('#voiceQuery');
        if(textarea.length)
            textarea.scrollTop(textarea[0].scrollHeight - textarea.height());
  }

  var _notRecognizedSentence = function(sentences) {
       if (Array.isArray(sentences)) {
           sentences = sentences[0];
        }
    
        $('#voiceQuery').val($('#voiceQuery').val() +" "+sentences);
        $('#voiceQuery').css('color','#000000');
        scrollTextBox();
  }

  var _recognizedSentence = function(phrase,command) {
      
        if(!(command == "voice search *tag" || command == "*tag1 voice search *tag2")){
    
            if(!errorMessage){
                $('#voiceQuery').val(phrase);
                $('#voiceQuery').css('color','#F44336');
            }
            else{
                errorMessage = false;
            }
            scrollTextBox();
        }
  }

  var voiceSearch_2 = function(tag1,tag2) {
        
        $('#voiceQuery').val(tag2);
        $('#voiceQuery').css('color','#F44336');
        scrollTextBox();
  }

  var voiceSearch_1 = function(tag) {
      
        $('#voiceQuery').val(tag);
        $('#voiceQuery').css('color','#F44336');
        scrollTextBox();
  }

  var toggleTopbar = function(){
        $('body').toggleClass('push-tobottom');
        $('#btnShowTopbar').toggleClass('topOpen');
        $('#btnShowSidebar').toggleClass('topOpen');
        $('#sidebarextension').toggleClass('topOpen');
        $('#topbar').toggleClass('open');
  }

  var toggleSidebar = function(){
        if($('#sidebar').hasClass('open') && $('#sidebarextension').hasClass('open')) {
            
            $('#sidebarextension').removeClass('open');
            $('#btnShowSidebar').removeClass('open');

        } 
        $('#sidebar').toggleClass('open');
        $('body').toggleClass('push-toright');
  }

  var searchCanvas = function(){
        search();
  }

  var addCanvas = function(){
        newShotInput();
  }

  var splitVideo = function(){
    
        var resultDisplayed = $(".videocontainer");
        if(resultDisplayed.length == 0){

            errorMessage = true;
            $('#voiceQuery').css('color','#000000');
            $('#voiceQuery').val("Query not executed as there is no video results retrieved");
        }
        else if(searchRunning){

            errorMessage = true;
            $('#voiceQuery').css('color','#000000');
            $('#voiceQuery').val("Please wait till search is in progress");
        }
        else if(resultDisplayed.length > 0){
            if(!splitVideoExecuted){
              
                sequenceSegmentation();
              }
            else{

                errorMessage = true;
                $('#voiceQuery').css('color','#000000');
                $('#voiceQuery').val("Query already executed");
            }
        }
        
  }

  // Add commands to annyang
  annyang.addCommands({
      
        'voice search *tag':voiceSearch_1,
        '*tag1 voice search *tag2': voiceSearch_2,
        'toggle top bar': toggleTopbar,
        'search canvas': searchCanvas,
        'add canvas': addCanvas,
        'split video': splitVideo,
        'toggle sidebar': toggleSidebar,

  });

  // set langauge English(UK)
  annyang.setLanguage('en-GB');

  // to print recognized speech in console
  annyang.debug(true);
  
  SpeechKITT.setStartCommand(annyang.start);
  SpeechKITT.setAbortCommand(annyang.abort);
  annyang.addCallback('start', SpeechKITT.onStart);
  annyang.addCallback('end', SpeechKITT.onEnd);

  annyang.addCallback('resultNoMatch', _notRecognizedSentence);
  annyang.addCallback('resultMatch', _recognizedSentence);


  SpeechKITT.setInstructionsText("Say 'voice search' followed by your Query");

  // Define a stylesheet for KITT to use
  SpeechKITT.setStylesheet('css/flat-pomegranate.css');

  // Render KITT's interface
  $(document).ready(function (){

      SpeechKITT.vroom();

  });
  
}
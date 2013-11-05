 // carver - a tool for editing sentences and paragraphs by justin wolfe (justin.wolfe@gmail.com)
 // 5/26/13
 
 var sentenceCounter = 0;
 var paragraphCounter = 0;
 var textArray = new Array();
 var originalTextArray = new Array();
 var mode = "menu";
 var documentMode = "default";
 var ctrlPressed = false;
 var textExists = false;
 
 $(document).ready(function() {
	loadLS();
	resizeMenuText("shortcuts");
	resizeMenuText("font");
	addEventListeners();
 });
 
 // localstorage functions
 
 function loadLS(){
	if (localStorage.runCarver != "yes"){
	} else {
		textArray = JSON.parse(localStorage.saveArray);
		originalTextArray = JSON.parse(localStorage.saveOriginalArray);
		textExists = true;
		var toBeorNot=confirm("The text from your previous session has been loaded.  Click 'OK' to return to it or click 'Cancel' to erase it and edit new text.");
		if (toBeorNot==true){
			updateSentenceLevel();
			modeShift("sentence");
		} else {
			localStorage.saveArray = "";
			localStorage.saveOriginalArray = "";
			textExists = false;
			localStorage.runCarver = "no"
		};
	};
 };
 
 function saveLS(){
	localStorage.saveArray = JSON.stringify(textArray)
 };
 
 // event listeners function
 
 function addEventListeners(){
 	$(window).resize(function() {
		resizeLine();
		resizeParagraph();
		resizeMenuText("shortcuts");
	});
	$(window).keydown(function(event){	
		var key = event.keyCode;
		if (key == 17) { 
			ctrlPressed = true;
		};
		if (key == 32) { 
			if (mode == "sentence"){
				resizeLine();
			};
			if (mode == "paragraph"){
				resizeParagraph();
			};
		};
		if (key == 188 && ctrlPressed == true){
			event.preventDefault();
			if (mode == "sentence"){
				decrementSentence();
				updateSentenceLevel();
			} else if (mode == "paragraph"){
				processParagraph("decrement");
			};
		};
		if (key == 190 && ctrlPressed == true){
			event.preventDefault();
			if (mode == "sentence"){
				incrementSentence();
				updateSentenceLevel();
			} else if (mode == "paragraph"){
				processParagraph("increment");
			};
		};	
		if (key == 77 && ctrlPressed == true){
			event.preventDefault();
			if (mode == "sentence"){
				textArray[paragraphCounter][sentenceCounter] = $("#sentenceEdit").val();
				updateParagraphLevel();
				modeShift("paragraph");
			} else if (mode == "paragraph"){
				processParagraph("toSentence");
			} else if (mode == "document"){
				if (documentMode == "default"){
					documentMode = "poetry";
				} else if (documentMode == "poetry"){
					documentMode = "indent";
				} else if (documentMode == "indent"){
					$("div#textDisplay p").css("text-indent", "0");
					documentMode = "default";
				};
				updateDocumentLevel();
			};
		};
		if (key == 221 && ctrlPressed == true && textExists == true){
			event.preventDefault();
			if (mode == "sentence" || mode == "paragraph"){
				if (mode == "sentence"){
					textArray[paragraphCounter][sentenceCounter] = $("#sentenceEdit").val();
				};
				if (mode == "paragraph"){
					processParagraph("toMenu");
				};
				modeShift("menu");
			} else if (mode == "menu"){
				modeShift("sentence");
			};
		};
		if (key == 219 && ctrlPressed == true){
			event.preventDefault();
			if (mode == "paragraph"){
				processParagraph("toDocument");
				$('body').css('overflow', 'visible');
			} else if (mode == "document"){
				modeShift("sentence");
				$('body').css('overflow', 'hidden');
			} else if (mode == "sentence"){
				textArray[paragraphCounter][sentenceCounter] = $("#sentenceEdit").val();
				updateDocumentLevel(documentMode);
				$('body').css('overflow', 'visible');
			};
		};
	});
	$(document).keyup(function(event) {
		if (event.keyCode == 17) {
			ctrlPressed = false;
		};			
	});
	$("#reviseButton").click(function(){
		inputText = $("#inputText").val();
		paragraphCounter = 0;
		sentenceCounter = 0;
		modeShift("load");
		processText();
	});
 };
 
 // update functions
 
  function updateSentenceLevel(){
	$("#sentenceEdit").val(textArray[paragraphCounter][sentenceCounter]);
	resizeLine();
 };
  
 function updateParagraphLevel(){
 	var copyString = textArray[paragraphCounter].join(" ");
	$("#paragraphEdit").val(copyString);
	resizeParagraph();
 };
 
 function updateDocumentLevel(){
	$("#textDisplay").empty();
	if (documentMode == "default"){
		var combineArray = new Array();
		for (i=0; i<textArray.length; i++){
			var combineParagraph = textArray[i].join(" ");
			$("#textDisplay").append("<p>" + combineParagraph + "</p>");
			if (combineParagraph != ""){
				$("#textDisplay").append("<br>");
			};	
		};
	};
	if (documentMode == "poetry" || documentMode == "indent"){
		var combineArray = new Array();
		for (i=0; i<textArray.length; i++){
			var combineParagraph = textArray[i].join(" ");
			$("#textDisplay").append("<p>" + combineParagraph + "</p>");
			if (combineParagraph == ""){
				$("#textDisplay").append("<br>");
			};	
		};	
		if (documentMode == "indent"){
			$("div#textDisplay p").css("text-indent", "2em");
		};
	};
	modeShift("document");
 };
 
  // resize functions
 
 function resizeLine(){
 	$("#lineDummy").text($("#sentenceEdit").val());
	$("#lineSizer").textfill({ maxFontPixels: 88 });
	var lineSize = $("#lineDummy").css("font-size");
	$("#middle").css("font-size", lineSize);
 };
 
 function resizeParagraph(){
	$("#paragraphDummy").text($("#paragraphEdit").val());
	$("#paragraphSizer").textfill({ maxFontPixels: 88 });
	var paragraphSize = $("#paragraphDummy").css("font-size");
	$("#currentParagraph").css("font-size", paragraphSize);
 };
 
 function resizeMenuText(type){
	var preferredHeight = 775;  
	var displayHeight = $(window).height();
	var displayWidth = $(window).width();
	var percentage = displayHeight / preferredHeight;
	if (type == "shortcuts"){
		var newFontSize = Math.floor(22 * percentage) - 1.5;
		if (displayWidth < 900){
			newFontSize = newFontSize - 1;
		};
		if (displayWidth < 750){
			newFontSize = newFontSize - 1;
		};
		if (displayWidth < 600){
			newFontSize = newFontSize - 1.5;
		};
		var newFontSize = newFontSize + "px";
		$("#savedTextsLeft").css("font-size", newFontSize);
	} else if (type == "font"){
		var newFontSize = Math.floor(35 * percentage) - 1.5;
		if (displayWidth < 1060){
			$("#fontSelect").css("font-size", "25px");
		}
		if (displayWidth < 1015){
			$("#fontSelect").css("font-size", "23px");
		};
		if (displayWidth < 950){
			$("#fontSelect").css("font-size", "20px");
		};
		if (displayWidth < 850){
			$("#fontSelect").css("font-size", "17px");
		};
		$("#savedTextsRight").css("font-size", newFontSize);
	};
 };
 
 // decrement/increment functions
 
 function decrementSentence(){
	textArray[paragraphCounter][sentenceCounter] = $("#sentenceEdit").val();
	if (sentenceCounter <= 1 && paragraphCounter == 0){
		sentenceCounter = 0;
	} else if (sentenceCounter >=1 && paragraphCounter == 0){
		sentenceCounter--;
	} else if (sentenceCounter <=1 && paragraphCounter >= 1){
		paragraphCounter--
		sentenceCounter = textArray[paragraphCounter].length - 1;
	} else if (sentenceCounter >=1 && paragraphCounter >= 1){
		sentenceCounter--;
	};
	saveLS();
 };
 
 function incrementSentence(){
	textArray[paragraphCounter][sentenceCounter] = $("#sentenceEdit").val();
	var lastSentenceIndex = textArray[paragraphCounter].length - 1;
	var lastParagraphIndex = textArray.length - 1;
	if (sentenceCounter < lastSentenceIndex){
		sentenceCounter++;
	} else if (sentenceCounter == lastSentenceIndex && paragraphCounter < lastParagraphIndex){
		sentenceCounter = 0;
		paragraphCounter++;
	} else if (sentenceCounter == lastSentenceIndex && paragraphCounter == lastParagraphIndex){
	};
	saveLS();
 };
 
 function decrementParagraph(){
	var lastParagraph = textArray.length - 1;
	if (paragraphCounter > 0){
		paragraphCounter--;
	} else if (paragraphCounter == 0){
		paragraphCounter = lastParagraph;
	};
 };
 
  function incrementParagraph(){
	var lastParagraph = textArray.length - 1;
	if (paragraphCounter < lastParagraph){
		paragraphCounter++;
	} else if (paragraphCounter == lastParagraph){
		paragraphCounter = 0;
	};
 };
 
 // processing functions

  function processText(){
	$.ajax({
		type: "POST",
		url: "splitter.php",
		dataType: 'text',
		data: { 
			processText: inputText
		},
		success: function(data) {
			textArray = jQuery.parseJSON(data);
			originalTextArray = jQuery.parseJSON(data);
			for (i=0; i<textArray.length; i++){
				for (j=0; j<textArray[i].length; j++){
					var processString = textArray[i][j];
					textArray[i][j] = $.trim(processString);
					originalTextArray[i][j] = $.trim(processString);
				};
			};
			localStorage.saveOriginalArray = JSON.stringify(originalTextArray)
			$("#inputText").val("");
			updateSentenceLevel();
			modeShift("sentence");
			textExists = true;
			localStorage.runCarver = "yes";
		},
		error: function(msg) {
			alert("the connection with the server has been lost!");
		}
	});
 };
   
 function processParagraph(type){
	var processCurrentParagraph = $("#paragraphEdit").val();
 	$.ajax({
		type: "POST",
		url: "paragraphsplitter.php",
		dataType: 'text',
		data: { 
			processText: processCurrentParagraph
		},
		success: function(data) {
			textArray[paragraphCounter] = jQuery.parseJSON(data);
			saveLS();
			if (type == "increment"){
				incrementParagraph();
				updateParagraphLevel();
			} else if (type == "decrement"){
				decrementParagraph();
				updateParagraphLevel();
			} else if (type == "toSentence"){
				$("#paragraphLevel").hide();
				$("#sentenceLevel").show();
				updateSentenceLevel();
				modeShift("sentence");
			} else if (type == "toDocument"){
				updateDocumentLevel();
				updateParagraphLevel();
				updateSentenceLevel();
				
			} else if (type == "toMenu"){
				updateParagraphLevel();
			};
		},
		error: function(msg) {
			alert("the connection with the server has been lost!");
		}
	});
 };
 
 // mode shift function
 
 function modeShift(toMode){
 	$("#sentenceLevel").hide();
 	$("#paragraphLevel").hide();
	$("#documentLevel").hide();
	$("#inputLevel").hide();
	$("#loadingLevel").hide();
	if (toMode == "sentence"){
		$("#sentenceLevel").show();
	} else if (toMode == "paragraph"){
		$("#paragraphLevel").show();
	} else if (toMode == "document"){
		$("#documentLevel").show();
	} else if (toMode == "menu"){
		$("#inputLevel").show();
	} else if (toMode == "load"){
		$("#loadingLevel").show();
	}
	resizeLine();
	resizeParagraph();
	mode = toMode;
	saveLS();
 };
 
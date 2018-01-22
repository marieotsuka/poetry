var html="";

var lexicon = new RiLexicon();

function processInput(){
	
	//split each line
	var lines = html.split('<br>');
	
	var words, pos, syl, stress, metre;
	var sylCount = 0;
	
	var compiled = [], tempWords = [], lastWords = [];

	//save list of last words in line
	for (var i=0; i<lines.length; i++){
		var tline = lines[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
		words = RiTa.tokenize(tline);
		lastWords.push(words[words.length-1]);
	}

	//for each line
	for (var i=0; i<lines.length; i++){

		//tokenize each word
		words = RiTa.tokenize(lines[i]);

		tempWords = words.slice(0);

		
		for (var j = 0; j < words.length; j++) {
			if (words[j].includes("’")){
				temp = words[j].split('’');
				words[j] = temp[0];
			}
		}	

		//Get POS
		pos = RiTa.getPosTags(words);
		

		//add wrappers for each word
		for (var j=0; j< words.length; j++){
			
			// Get syllable count
			syl = RiTa.getSyllables(words[j]);
			sylCount = syl.split("/").length;	

			// Get stress symbols
			stress = RiTa.getStresses(words[j]);
			metre = stress.replace(/\//g,' ')
						  .replace(/0/g,'/')
						  .replace(/1/g,'x');

			words[j] = "<div class='"+pos[j]+" s"+sylCount+"'><span class='text'>" + tempWords[j] + "</span> <span class='m'>" + metre + "</span> </div>";
		}

		//join words into line
		var line = words.join(" ")+"<br>";
		
		//remove space before punctuation
		line = line.replace(/\s+(<div class=')+([,:;!.)])/g,'$1$2');
		
		//join all lines
		compiled.push(line);
	}

	$(".poem").html(compiled).fadeIn(600);

}

function controls(selector, view){
    $(selector).click(function () {
        $(".poem").toggleClass(view);
        $(this).toggleClass("on");
    });
}


// Enter your own text
function submitText(){
	$("#textInput").submit(function(){
		$(this).fadeOut(400);
		//process textarea input
		html = $("textarea").val().replace(/\n\r?/g, '<br>');
		processInput(html);

		var title = $("#title").val();
		var author = $("#author").val();

		//add title and author
		$(".poem").prepend("<p class='heading'><span class='poemTitle'>" + title + "</span> <span class='poemAuthor'>" + author + "</span></p>");
				
		return false;
	});
}

$(document).ready(function(){

	var key = ["#pos", "#syl", "#mtr", "#txt"];
	var toggleClasses = ["grammar", "syllables", "metre", "hideText"];

	//build toggle tools
	for (var k=0; k<key.length; k++){
		controls(key[k], toggleClasses[k]);
	} 	

	// Mobile Nav
	function resetNav(){
	  if($("button.menu").css("display") === "none"){
	    $("nav").removeClass("mobile").removeAttr("style");
	  }
	}

	$(window).resize(resetNav);

	$("button.menu").click(function (){
	  $("nav").addClass("mobile").slideToggle();
	  $(this).blur();
	});

});
var testType, scoreL, scoreR, scoreT, crtpage, qnum;
var testSel = [];
var chk = [];
var answer= new Array();
answer[0] = [2,3,1,1,2,2,3,2,1,3,1,2,2,1,2,1,1,2,3,1,2,2,1,2,1,2,1,3,2,3];
answer[1] = [3,3,1,1,3,2,2,2,3,2,2,2,1,2,1,2,2,2,3,2,2,1,2,2,1,2,1,3,2,1];
answer[2] = [2,2,1,2,3,1,1,2,3,2,1,3,2,'bucket','slide','floor','tall',1,3,2,2,2,2,2,1,1,3,2,1,2];
answer[3] = [3,3,3,1,4,2,1,3,2,3,'excitedly','grow up','observant','beat',3,2,2,1,2,2,1,2,'Hamster has big, dark eyes and a very short tail','That’s about half the weight of a normal car','We had to decide how we were going to design our book','Some authors create tales from their own life experiences',1,2,3,4];
answer[4] = [2,4,2,1,4,4,1,3,3,4,'positive','unveiled','contribution','describe',2,3,3,4,'buying','yourself','was called','have written',2,3,2,2,2,3,1,3];
var crtLevel = new Array();
crtLevel[0] = ['Pre K & K','초등 1단계','초등 2단계'];
crtLevel[1] = ['초등 1단계','초등 2단계','초등 3단계'];
crtLevel[2] = ['초등 2단계','초등 3단계','초등 4단계'];
crtLevel[3] = ['초등 4단계','초등 5단계','초등 6단계'];
crtLevel[4] = ['초등 5단계','초등 6단계','중학'];

var audio = new Audio();
var qnext = true;

$(function(){
	$(".btn_next").on("click", function(){
		qnext=true;
		chkquestion();
		audio.pause();
		if(qnext){
			leveltest.score();
			if($(this).hasClass("last")){
				leveltest.view('last');
			}else{
				crtpage++;
				leveltest.view(crtpage);
			}
		}
	})
	$(".btn_result").on("click", function(){
		leveltest.result();
	});

	$(".answer label").on("click", function(){
		$(this).closest(".answer").find("label.on").removeClass("on");
		if($(this).find("input:radio").is(":checked")){
			$(this).addClass("on");
		}
	})

	$(".btn_sound").on("click", function(){
		audioPlay($(this));
	});
})
function comment_save(){
	$.get("/board/comment_save" ,
        {
        	EL_IDX : $.trim($("#comment_idx").val()),
        	EL_COMMENT : $("#comment_data").val()
        },
        function(rslt){
        	alert('저장이 완료되었습니다.')
        });
}
function chkquestion(){
	var $page = $("#"+testType+"_"+crtpage);
	var q = $page.find(".answer");
	q.each(function(index, el) {
		var value;
		if($(this).hasClass("ipttxt")){
			var input = $(this).find("input:text");
			value = input.val();
		}else{
			var radioButtons = $(this).find("input:radio");
			var selectedIndex = radioButtons.index(radioButtons.filter(':checked'));
			value = selectedIndex+1;	
		}
		if(value==0 || value=='') {
			alert("풀지않은 문제가 있습니다. 답을 표시한 후 --> 버튼을 눌어 주세요");
			qnext=false;
			return false;
		}
	});
}


var leveltest = {
	go:function(type){
		testType = type;
		$(".test_index").hide();
		crtpage=1;
		qnum=1;
		leveltest.view("1");
	},
	view:function(obj){
		if(qnum<11) audioPlay();
		$(".test_wrap.on").removeClass("on");
		var $obj = $("#"+testType+"_"+obj);
		$obj.addClass("on");	
	},
	score:function(obj){
		var $page = $("#"+testType+"_"+crtpage);
		var q = $page.find(".answer");
		q.each(function(index, el) {
			if($(this).hasClass("ipttxt")){
				var input = $(this).find("input:text[name='"+testType+"_"+qnum+"']");
				var value = input.val();
			}else{
				var radioButtons = $(this).find("input:radio[name='"+testType+"_"+qnum+"']");
				var selectedIndex = radioButtons.index(radioButtons.filter(':checked'));
				var value = selectedIndex+1;	
			}
			testSel.push(value);
			qnum++;
		});
	},
	result:function(){
		var q =1;
		var testNum, stepstr;
		scoreL = 0;
		scoreR = 0;
		if(testType == 'A') { testNum = 0; stepstr = "LEVEL TEST 1. (~1년)"; }
		if(testType == 'B') { testNum = 1; stepstr = "LEVEL TEST 2. (1~2년)"; }
		if(testType == 'C') { testNum = 2; stepstr = "LEVEL TEST 3. (3~4년)"; }
		if(testType == 'D') { testNum = 3; stepstr = "LEVEL TEST 4. (4~5년)"; }
		if(testType == 'E') { testNum = 4; stepstr = "LEVEL TEST 5. (5년~)"; }

		$.each(testSel, function(index, value){
			var snum = value;
			var anum = answer[testNum][index];
			var cbl = 1;
			if(snum!=anum){
				q++;
				cbl=0;
				chk.push(cbl)
				return;
			}
			chk.push(cbl)
			if(q<11){
				scoreL = scoreL + 10;
			}else{
				scoreR = scoreR + 5;
			}
			q++;
		})

		$(".test_last").removeClass("on");
		var $result = $("#result");
		
		scoreT = Math.round((scoreL+scoreR)/2);
		$result.addClass("on");

		if(scoreT < 41) {
			var lv = 'c';
			var lvindex = 0;
		}
		if(scoreT < 81 && scoreT >40) {
			var lv = 'b';
			var lvindex = 1;
		}
		if(scoreT > 80) {
			var lv = 'a';
			var lvindex = 2;
		}

		if(scoreL < 41) var lvL = 'c';
		if(scoreL < 81 && scoreL >40) var lvL = 'b';
		if(scoreL > 80) var lvL = 'a';

		if(scoreR < 41) var lvR = 'c';
		if(scoreR < 81 && scoreR >40) var lvR = 'b';
		if(scoreR > 80) var lvR = 'a';

		var d = new Date();
		var month = d.getMonth()+1;
		var day = d.getDate();
		var date = (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + "/" + d.getFullYear();

		$result.find(".scoreL").html(scoreL);
		$result.find(".scoreR").html(scoreR);
		$result.find(".scoreT").html(scoreT);
		$result.find("#step").html(stepstr);
		$result.find(".toptxt .date").html(date);
		$result.find(".crtLevel").html(crtLevel[testNum][lvindex]);
		$result.find(".test_sec .graph").addClass('lv'+lv);
		$result.find(".listening_wrap").addClass('step_'+testType+"_"+lvL);
		$result.find(".reading_wrap").addClass('step_'+testType+"_"+lvR);


		var _lev = crtLevel[testNum][lvindex];
	    var gradeLev;
	    if(_lev=='Pre K & K'){
	        gradeLev = 2;
	    }else if(_lev=='초등 1단계'){
	        gradeLev = 3;
	    }else if(_lev=='초등 2단계'){
	        gradeLev = 4;
	    }else if(_lev=='초등 3단계'){
	        gradeLev = 5;
	    }else if(_lev=='초등 4단계'){
	        gradeLev = 6;
	    }else if(_lev=='초등 5단계'){
	        gradeLev = 7;
	    }else if(_lev=='초등 6단계'){
	        gradeLev = 8;
	    }else if(_lev=='중학'){
	        gradeLev = 9;
	    }

        testArr();

	    $(window).resize(function(event) {
	        /* Act on the event */
	        testArr();
	    });

	    function testArr(){
		    var $gradeTb = $("#testGradeTb");
		    var $arrBar = $("#arrBar");
		    var _colW = $("#arrCol").innerWidth();
		    var _wid = _colW * gradeLev+gradeLev-17;
		    $arrBar.css({'width':_wid})

		    console.log(_wid)
		}

		$.get("/board/leveltest_save" ,
        {
        	EL_TESTYPE : testType,
            EL_SCOREL : scoreL,
            EL_SCORER : scoreR,
            EL_SCORET : scoreT,
            EL_TESTYPE_TXT : stepstr,
            EL_DATE : date,
            EL_CRTLEVEL : crtLevel[testNum][lvindex],
            EL_LV : 'lv'+lv,
            EL_TESTTYPE_LVL : 'step_'+testType+"_"+lvL,
			EL_TESTTYPE_LVR : 'step_'+testType+"_"+lvR
			
			
        },
        function(rslt){
        	var result=$.trim(rslt); 
        	if(result){
        		$("#comment_idx").val(result);
        		$(".btn_save").css("display","inline-block");
        	}
        });
	}
}




function audioPlay(obj){
	if(!obj){
		var $page = $("#"+testType+"_"+crtpage);
		var src = $page.find(".btn_sound").attr("title")
	}else{
		var src = $(obj).attr("title")
	}
	audio.src="http://www.ebricks.co.kr/leveltest/mp3/"+src;
	audio.load();
	audio.play();
}


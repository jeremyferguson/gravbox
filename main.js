var input_sent = '';
var waiting_for_input = false;
var json = '';
var output = '';
var code = '';
var balls = [];
var direction = 2;
var start_step = 0;
var jsons = [];
var curr_step = 0;
var interval = 0;
var intervalID = 0;
var paths = [];
var stack = '';
var sample_programs = {'beer':" @          ^ +-01        .......   @\n  ' @ @      @@                             @.......   ...@\n  6 .        @ .....................@       &             .\n  5  @ ....... .....on*48the*48wall*4+65*48   @           .\n  + %@@       .                              @@           .\n  9 ^         .                            %            @@.\n  * ;         .                            @25*dnuora4   @.\n  ^    @@ @@ @ *25Take*48one*48down*4+65*48pass*48it*8   @.\n~&; 0  @   @ @@                                         @@.\n     ///  \n  @1  @   @  48*reeb48*fo48*selttob48*                    @\n    @@",
	'forloop': " @'+   @\n  2    -\n  5    0 \n  *    1\n~&^    .\n  @;25*@",
	'hello':" '\n @92+3*dlroW84*92+4*olleH..............~",
	'factorial':"\n @     +@\n &\n '      -\n%1      0\n ,      1\n &      ^\n  @     @\n @.  @\n/\n   \n &   *\n~ *  5\n  &\n ~ ^ 2\n   @;@"}

function init(){
	document.getElementById('input-area').value = '';
	document.getElementById('stop-button').disabled = true;
	document.getElementById('skip-next').disabled = true;
	document.getElementById('run-button').disabled = true;
	document.getElementById('skip-prev').disabled = true;
	document.getElementById('resume-button').disabled = true;
	document.getElementById('sample_programs').onchange = function(){
		var index = this.selectedIndex;
		var selected = this.children[index].value;
		if(selected == 'default'){return;}
		else{
			document.getElementById('code_grid').value = sample_programs[selected];
		}
	}
}
window.onload = init;
function compile(asStage,st=''){
	balls = [];
	if (asStage){
		read_input();
		//console.log(balls);
		//console.log(stack);
		start_step = max_steps+1;
	}
	else{
		paths = [];
		jsons = [];
		read_code();
		output = {};
		start_step = 0;
		document.getElementById('input-area').value = '';
		document.getElementById('code_output_inner').innerHTML='';
		document.getElementById('stop-button').disabled = true;
		document.getElementById('skip-next').disabled = true;
		document.getElementById('run-button').disabled = false;
		document.getElementById('skip-prev').disabled = true;
		document.getElementById('resume-button').disabled = true;
	}
	const xhr = new XMLHttpRequest();
	var url = 'https://platinumherring.com/app/gravbox';
	xhr.open("POST",url,true);
	//xhr.withCredentials=true;
	data = JSON.stringify({
		'code':code,
		'stack':st,
		'balls':balls,
		'direction':direction,
		'step':start_step});
	//console.log(data);
	xhr.setRequestHeader('Content-Type','application/json');
	console.log(xhr);
	xhr.send(data);
	xhr.onreadystatechange = function (){
		if (xhr.readyState === 4 && xhr.status === 200){
			json = JSON.parse(xhr.responseText);
			jsons.push(json);
			output = Object.assign(output,json['output']);
			direction = json['direction'];
			if(paths.length == 0){
				paths = [].concat(json['paths']);
			}
			else{
				for(var i = 0;i<Math.min(paths.length,json['paths'].length);i++){
					paths[i] = paths[i].concat(json['paths'][i].slice(1));
				}
			}
			max_steps = json['steps'];
			if(waiting_for_input){
				curr_step ++;
				run();
			}
		}
	}
}
function run(){
	if(!waiting_for_input){
		jsons = jsons.slice(0,1);
		json = jsons[0];
		curr_step = 0;
		direction = 2;
		stack = [];
		paths = [].concat(json['paths']);
		max_steps = json['steps'];
		//count_balls(code);
		//console.log(paths);
		//console.log(curr_step);
		document.getElementById('code_output_inner').innerHTML='';
		//console.log('running from start');
		document.getElementById('stop-button').disabled = false;
		document.getElementById('skip-next').disabled = true;
		document.getElementById('skip-prev').disabled = true;
		document.getElementById('resume-button').disabled = true;
		document.getElementById('input-area').value = '';
		interval = parseInt(document.getElementById('interval-input').value);
	}
	clearInterval(intervalID);	
	document.getElementById('code_output_messages').innerHTML = '';
	document.getElementById('input-messages').innerHTML = '';
	if(interval == 0 || interval > max_steps){
		curr_step = max_steps;
	}
	intervalID = setInterval(function(){run_step();},1000);
	waiting_for_input = false;
}
function run_step(){
	//console.log(curr_step);
	document.getElementById('code_output_inner').innerHTML = format_output(output);
	balls = [];
	for(var i = 0;i<paths.length;i++){
		balls.push(paths[i][curr_step]);
	}
	document.getElementById('grid_display_inner').innerHTML = print_grid();
	if(curr_step >= max_steps){
		clearInterval(intervalID);
		document.getElementById('stop-button').disabled = true;
		document.getElementById('skip-next').disabled = true;
		document.getElementById('skip-prev').disabled = true;
		document.getElementById('resume-button').disabled = true;
		if (json['status'] === 2){
			document.getElementById('code_output_messages').innerHTML = 
				'Error: <br>'+json['error'] + '<br>Stack at time of error: <br>' 
			if(json['stack']){
				document.getElementById('code_output_messages').innerHTML += json['stack']
			}
			else{
				document.getElementById('code_output_messages').innerHTML+='Empty stack'; 
			}
		}
		if (json['status'] == 0){
			document.getElementById('input-messages').innerHTML ='Waiting for input...';
			stack = [].concat(json['stack']);
			waiting_for_input = true;
			paths = [].concat(json['paths']);
		}
		return;
	}
	if (curr_step == max_steps){
		curr_step += 1;
	}
	else{
		curr_step = Math.min(curr_step+interval,max_steps);
	}
}
function handle_input(){
	if (waiting_for_input){
		var nextInput = document.getElementById('input-area').value;
		nextInput = nextInput[nextInput.length-1]
		if(!isNaN(nextInput)){
			nextInput = parseInt(nextInput);
		}
		stack.splice(0,0,nextInput)
		compile(true,stack);
	}
}
function read_code(){
	code = document.getElementById('code_grid').value;
	code = count_balls(code);
	//console.log(code);
}
function read_input(){
	var grid = document.getElementById('grid_display_inner').innerHTML;
	//console.log(grid.split(""));
	count_balls(grid);
	//console.log(balls);
}
function count_balls(grid){
	var newlines = 0;
	var last_newline_pos = -1;
	var next_newline = 0;
	var next_ball = 0;
	while(grid.search("'") != -1){
		next_newline = grid.slice(last_newline_pos+1).search("\n");
		next_ball = grid.search("'");
		if(next_newline+(last_newline_pos+1) > next_ball || next_newline == -1){
			balls.push([next_ball-(last_newline_pos+1),newlines]);
			grid = grid.replaceAt(next_ball," ");
		}
		else{
			last_newline_pos += (next_newline+1);
			newlines ++;
		}
	}
	return grid;
}
function pause_running(){
	clearInterval(intervalID);
	document.getElementById('stop-button').disabled = true;
	document.getElementById('skip-next').disabled = false;
	document.getElementById('skip-prev').disabled = false;
	document.getElementById('resume-button').disabled = false;
}
function skip_next(){
	run_step();
}
function skip_prev(){
	curr_step = Math.max(0,curr_step - 2*interval);
	run_step();
}
function resume_running(){
	document.getElementById('stop-button').disabled = false;
	document.getElementById('skip-next').disabled = true;
	document.getElementById('skip-prev').disabled = true;
	document.getElementById('resume-button').disabled = true;
	interval = parseInt(document.getElementById('interval-input').value);
	if(interval == 0 || curr_step > max_steps){
		curr_step = max_steps;
	}
	intervalID = setInterval(function(){run_step();},1000);
}
function print_grid(){
	var grid_str = ('' + json['state']);
	for(var i = 0;i<balls.length;i++){
		var width = json['state'].search("\n")+1;
		var str_pos = balls[i][1]*width+balls[i][0];
		grid_str = grid_str.replaceAt(str_pos,"'");
	}
	return grid_str;
}
function format_output(output){
	var output_str = '';
	for (v in output){
		if(v<curr_step){
			output_str += output[v];
		}
	}
	return output_str;
}
String.prototype.replaceAt=function(index, replacement) {
	return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

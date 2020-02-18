<!DOCTYPE html>
<?php
	echo '<link rel="stylesheet" href="../css/main.css">';
?>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="description" content="Ultra Turbulent Juice 2.0">
	<meta name="keywords" content="Test,Platinum,Herring,Metal,Fish,Platinum Herring">
	<meta name="author" content="David and Jeremy">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Gravbox IDE</title>
	<link rel="shortcut icon" href="../images/favicon.ico">
	<link rel="stylesheet" href="../css/main.css">
	<script src = './main.js'></script>
</head>
	
<body>
	<?php
		include('../scripts/LoginHeader.php');
	?>
	
	<?php
		include('../scripts/menu.php');
	?>
	
	<main>
	<h2>Gravbox</h2>
	<h4 class="para"> Gravbox is an esoteric programming language outlined in <a href="https://esolangs.org/wiki/Gravbox">this</a> specificiation.  It operates as a two-dimensional space, with balls that move according to the direction of gravity, and interact with their environment to interact with a stack, as well as process input and output.</h4>
	<h4 class="para">For this project, I decided to make an online IDE for it, using Python with the Flask framework for the back end, and Javascript for the front end.  The program also runs as a standalong Python script in the command line.</h4>
		<div id = "ide">
			<div id = 'left_half'>
				<div id = "toolbar">
				<button class = "mySubmit" onclick = "compile(false)">Compile</button>
				<button class = "mySubmit" id = 'run-button' onclick = "run()">Run</button>
				<button class = "mySubmit" id = 'skip-prev' onclick = "skip_prev()"><</button>
				<button class = "mySubmit" id = 'stop-button' onclick = "pause_running()">||</button>
				<button class = "mySubmit" id = 'skip-next' onclick = "skip_next()">></button>
				<button class = "mySubmit" id = 'resume-button' onclick = "resume_running()">|></button>
				<p style = 'display:inline;padding-left:5px'> Interval:</p>
				<input id = 'interval-input' type = 'number'value = "0" style = 'width:60px'></input>
				<select id = 'sample_programs'>
				<option value='default'>Select sample program:</option>
				<option value='hello'>Hello, World!</option>
				<option value='forloop'>Basic For Loop</option>
				<option value='beer'>99 Bottles of Beer</option>
				<option value='factorial'>Factorial</option>
				</select>
				</div>
				<textarea id = "code_grid" rows = "25" placeholder = "Write your code here!"></textarea>
			</div>
			<div id = 'right_half'>
				<div id = "reference">
					<h2>Gravbox reference table</h4>
					<table id = 'ref-table'>
						<tr class='ref-row'><td>@</td><td>Switch the direction of gravity counter-clockwise</td>
						</tr>
						<tr class='ref-row'><td>a-z,A-Z,0-9</td><td>Push to the stack, either as a character or number</td></tr>
						<tr class='ref-row'><td>/</td><td>Send a ball temporarily to the right</td></tr>
						<tr class='ref-row'><td>\</td><td>Send a ball temporarily to the left</td></tr>
						<tr class='ref-row'><td>!</td><td>Takes the reciprocal of the top element of the stack, keeping it on the top position</td></tr>
						<tr class='ref-row'><td>+</td><td>Adds the top two values of the stack, pushes the result</td></tr>
						<tr class='ref-row'><td>-</td><td>Subtracts the first value on the stack from the second value</td></tr>
						<tr class='ref-row'><td>*</td><td>Multiplies the top two values on the stack</td></tr>
						<tr class='ref-row'><td>|</td><td>Divides the first value on the stack from the second value</td></tr>
						<tr class='ref-row'><td>^</td><td>Duplicates the top value on the stack</td></tr>
						<tr class='ref-row'><td>%</td><td>Deletes the top value on the stack</td></tr>
						<tr class='ref-row'><td>#</td><td>Stops any balls from moving past</td></tr>
						<tr class='ref-row'><td>.</td><td>Outputs the top value on the stack as a character, using ASCII codes if the top value is a number</td></tr>
						<tr class='ref-row'><td>;</td><td>Outputs the top value on the stack as a number, using ASCII codes if the top value is a character</td></tr>
						<tr class='ref-row'><td>,</td><td>Takes input and pushes it to the stack</td></tr>
						<tr class='ref-row'><td>?</td><td>Randomly sends the ball temporarily to the right or the left</td></tr>
						<tr class='ref-row'><td>&</td><td>Sends the ball temporarily to the left if the value on the top of the stack is less than or equal to 0, otherwise sends it temporarily to the right</td></tr>
						<tr class='ref-row'><td>$</td><td>Pushes the length of the stack to the stack</td></tr>
						<tr class='ref-row'><td>~</td><td>Ends the program</td></tr>
						<tr class='ref-row'><td>:</td><td>Swap the top and bottom of the stack</td></tr>
					</table>
				</div>
				<div id = "code_input">
					<p style = "white-space: pre-wrap" id = "input-messages"></p>
					<textarea id = "input-area" placeholder = "Input for Gravbox program (type while program is running)" rows = 6 oninput = 'handle_input()'></textarea>
				</div>
				<div id = "grid_display">
					<p style = 'color:white'>Grid state:</p>
					<code style = "white-space: pre-wrap" id = "grid_display_inner"></code>
				</div>
				<div id = "code_output">
					<p>Program output:</p>
					<p id = 'code_output_messages'></p>
					<p style = "white-space: pre-wrap" id = "code_output_inner"></p>
				</div>
			</div>
		</div>
	</main>
</body>

</html>

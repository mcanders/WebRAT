//console.log shorthand
var cl = function(text) {
	console.log(text);
}

var currentBlock = null;
var currentParent = null;
var connectionAddress = null;
var connectionPort = null;
var connectionDatabase = null;
var connectionUser = null;
var connectionPassword = null;
var lastScroll = 0;
function init() {
	var queryEditor = document.getElementById("queryEditor");
	var consoleSQL = document.getElementById("consoleSQL");
	var baseNode = document.createElement('div');
	queryEditor.appendChild(baseNode);
	queryEditor.children[0].isLeaf = true;

	currentParent = queryEditor;
	currentBlock = queryEditor.children[0];


	var selectButton = document.getElementById("selectButton");
	var projectButton = document.getElementById("projectButton");
	var unionButton = document.getElementById("unionButton");
	var intersectButton = document.getElementById("intersectButton");
	var crossButton = document.getElementById("crossButton");
	var subtractButton = document.getElementById("subtractButton");
	var joinButton = document.getElementById("joinButton");
	var thetaJoinButton = document.getElementById("thetaJoinButton");
	var fullOuterJoinButton = document.getElementById("fullOuterJoinButton");
	var thetaOuterJoinButton = document.getElementById("thetaOuterJoinButton");
	var rightOuterJoinButton = document.getElementById("rightOuterJoinButton");
	var thetaRightOuterJoinButton = document.getElementById("thetaRightOuterJoinButton");
	var leftOuterJoinButton = document.getElementById("leftOuterJoinButton");
	var thetaLeftOuterJoinButton = document.getElementById("thetaLeftOuterJoinButton");
	var assignButton = document.getElementById("assignButton");
	var relationButton = document.getElementById("relationButton");

	selectButton.onclick = function(){addOperatorConditionRelation("images/small_select.png", selectToSQL)};
	projectButton.onclick = function(){addOperatorConditionRelation("images/small_project.png", projectToSQL, "columnNames")};
	unionButton.onclick = function(){addRelationOperatorRelation("images/small_union.png", unionToSQL)};
	intersectButton.onclick = function(){addRelationOperatorRelation("images/small_intersect.png", intersectToSQL)};
	crossButton.onclick = function(){addRelationOperatorRelation("images/small_cross.png", crossToSQL)};
	subtractButton.onclick = function(){addRelationOperatorRelation("images/small_subtract.png", subtractToSQL)};
	joinButton.onclick = function(){addRelationOperatorRelation("images/small_join.png", joinToSQL)};
	thetaJoinButton.onclick = function(){addRelationOperatorConditionRelation("images/small_join.png", thetaJoinToSQL)};
	fullOuterJoinButton.onclick = function(){addRelationOperatorRelation("images/small_fulljoin.png", fullOuterJoinToSQL)};
	thetaOuterJoinButton.onclick = function(){addRelationOperatorConditionRelation("images/small_fulljoin.png", thetaOuterJoinToSQL)};
	rightOuterJoinButton.onclick = function(){addRelationOperatorRelation("images/small_rightjoin.png", rightOuterJoinToSQL)};
	thetaRightOuterJoinButton.onclick = function(){addRelationOperatorConditionRelation("images/small_rightjoin.png", thetaRightOuterJoinToSQL)};
	leftOuterJoinButton.onclick = function(){addRelationOperatorRelation("images/small_leftjoin.png", leftOuterJoinToSQL)};
	thetaLeftOuterJoinButton.onclick = function(){addRelationOperatorConditionRelation("images/small_leftjoin.png", thetaLeftOuterJoinToSQL)};
	assignButton.onclick = function(){addRelationOperatorRelation("images/small_assign.png", assignToSQL)};
	relationButton.onclick = function(){addRelation()};

	selectButton.style.backgroundImage = "url(images/select.png)";
	projectButton.style.backgroundImage = "url(images/project.png)";
	unionButton.style.backgroundImage = "url(images/union.png)";
	intersectButton.style.backgroundImage = "url(images/intersect.png)";
	crossButton.style.backgroundImage = "url(images/cross.png)";
	subtractButton.style.backgroundImage = "url(images/subtract.png)";
	joinButton.style.backgroundImage = "url(images/join.png)";
	thetaJoinButton.style.backgroundImage = "url(images/thetajoin.png)";
	fullOuterJoinButton.style.backgroundImage = "url(images/fulljoin.png)";
	thetaOuterJoinButton.style.backgroundImage = "url(images/thetafulljoin.png)";
	rightOuterJoinButton.style.backgroundImage = "url(images/rightjoin.png)";
	thetaRightOuterJoinButton.style.backgroundImage = "url(images/thetarightjoin.png)";
	leftOuterJoinButton.style.backgroundImage = "url(images/leftjoin.png)";
	thetaLeftOuterJoinButton.style.backgroundImage = "url(images/thetaleftjoin.png)";
	assignButton.style.backgroundImage = "url(images/assign.png)";
	relationButton.style.backgroundImage = "url(images/relation.png)";

	// setOutput(queryEditor.children[0].toSQL());

	document.onkeydown = function(e) {
		if(e.keyCode == "13") {
			var textEditor = document.getElementById("textEditor");
			var textEditorInput = document.getElementById("textEditorInput");
			textEditor.textDiv.textContent = textEditorInput.value;
			textEditor.style.display = "none";
		}
	}


	queryEditor.onclick = function() {
		if(currentBlock != null && currentBlock.deselect != undefined) {
			currentBlock.deselect();		
			currentBlock = null;	
		}
		if(document.getElementById("textEditor").style.display == "block") {
			document.getElementById("textEditor").style.display="none";
		}
		if(document.getElementById("connectWindow").style.display == "block") {
			document.getElementById("connectWindow").style.display="none";
		}
		if(document.getElementById("helpWindow").style.display == "block") {
			document.getElementById("helpWindow").style.display="none";
		}
	}
	window.onresize = function() {
		document.getElementById("queryEditor").style.width = "" + 
			(window.innerWidth-300)+"px";
		document.getElementById("consoleSQL").style.width = "" + 
			(window.innerWidth-45)+"px";
		document.getElementById("consoleOutput").style.width = "" + 
			(window.innerWidth-45)+"px";
		document.getElementById("menu").style.width = "" + 
			(window.innerWidth-45)+"px";
	}
	window.onresize();
}
function showConnectWindow() {
	var connectWindow = document.getElementById("connectWindow");
	connectWindow.style.display = "block";
}
function showHelp() {
	var helpWindow = document.getElementById("helpWindow");
	helpWindow.style.display = "block";
}
function hideHelp() {
	var helpWindow = document.getElementById("helpWindow");
	helpWindow.style.display = "none";
}
function connectToDB() {
	var address = document.getElementById("connectWindowAddress").value;
	var port = document.getElementById("connectWindowPort").value;
	var user = document.getElementById("connectWindowUser").value;
	var password = document.getElementById("connectWindowPassword").value;
	var database = document.getElementById("connectWindowDatabase").value;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/Connect", true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send("address="+address+"&port="+port+"&user="+user+"&password="+password+"&database="+database);
	xhr.onreadystatechange = function(){
		if (this.readyState == 4) {
		    if (this.status == 200){
	    		var connectWindowButton = document.getElementById("connectWindowButton");
		    	if(this.responseText == "failure") {
		    		connectWindowButton.style.backgroundColor = "red";
		    		connectWindowButton.textContent = "Failed";
		    		setOutput("Error: Could Not Connect To Database")
		    	}
		    	else {
		    		connectionAddress = address;
		    		connectionPort = port;
		    		connectionDatabase = database;
		    		connectionUser = user;
		    		connectionPassword = password;
		    		connectWindowButton.style.backgroundColor = "green";		    		
		    		connectWindowButton.textContent = "Success";
		    		var tables = JSON.parse(this.responseText);
		    		// console.log(tables);
		    		var currentTable = null;
		    		for(var i = 0; i < tables.length; i++) {
		    			var entry = tables[i];
		    			if(entry.TABLE_NAME != currentTable) {
		    				addTable(entry.TABLE_NAME);
		    				currentTable = entry.TABLE_NAME;
		    			}
		    			addColumn(entry.DATA_TYPE + " " +entry.COLUMN_NAME);
		    		}
		    	}
		    }
		    else {
		        console.log("XMLHttpRequest error: " + xhr.status);
		    }
		} 
	};
}
function addTable(name) {
	var relations = document.getElementById("relations");
	var newTable = document.createElement('div');
	newTable.className = "relationTable";
	newTable.textContent = name;
	relations.appendChild(newTable);
}
function addColumn(name) {
	var relations = document.getElementById("relations");
	var newColumn = document.createElement('div');
	newColumn.className = "relationColumn";
	newColumn.textContent = name;
	relations.appendChild(newColumn);
}
function runQuery() {
	var sqlDiv = document.getElementById("consoleSQL");
	var sqlText = sqlDiv.value.substring(sqlDiv.selectionStart,
		sqlDiv.selectionEnd);
	if(sqlText == "") {
		setOutput("Could Not Execute Query: No SQL selected to be run in the SQL editor");
	}
	else if(connectionAddress == null) {
		setOutput("Could Not Execute Query: Not Connected To A Database");
	}
	else {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "/Query", true);
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.send("address="+connectionAddress+"&port="+connectionPort+"&user="
			+connectionUser+"&password="+connectionPassword+"&database="
			+connectionDatabase+"&query="+sqlText);
		xhr.onreadystatechange = function(){
			if (this.readyState == 4) {
			    if (this.status == 200){
			    	var rows = JSON.parse(this.responseText);
			    	console.log(rows)
			    	if(typeof rows == "string") {
			    		setOutput(rows)
			    	}
			    	else {
			    		setOutputTable(rows);
			    	}
			    }
			    else {
			        console.log("XMLHttpRequest error: " + xhr.status);
			    }
			} 
		};
	}
}
function SQLConvert() {
	var queryEditor = document.getElementById("queryEditor");
	var sqlText = queryEditor.children[0].toSQL();
	if(sqlText.charAt(0) == "(") {
		sqlText = sqlText.substring(1,sqlText.length-1);
		console.log("fixed")
	}
	return sqlText;
}
function setConsoleSQL(text) {
	var consoleDiv = document.getElementById("consoleSQL");
	consoleDiv.value += "\r\n"+text + "\r\n";
	consoleDiv.value = consoleDiv.value.replace(/^(\s|\r\n)*/, '');
	console.log(consoleDiv.scrollTop, lastScroll)
	consoleDiv.scrollTop = consoleDiv.scrollHeight;
	lastScroll = consoleDiv.scrollTop;
	if(lastScroll > consoleDiv.scrollTop) {
		consoleDiv.scrollTop = consoleDiv.scrollHeight;
		lastScroll = consoleDiv.scrollTop;
	}

}
function clearConsoleSQL() {
	var consoleDiv = document.getElementById("consoleSQL");
	consoleDiv.value ="";
}
function setOutput(text) {
	var consoleDiv = document.getElementById("consoleOutput");
	consoleDiv.innerHTML = "";
	consoleDiv.textContent = text;
}
function setOutputTable(rows) {
	var consoleDiv = document.getElementById("consoleOutput");
	var table = document.createElement('table');
	table.className = "outputTable";
	var tr = table.insertRow(-1);
	for(var column in rows[0]) {
		var td = tr.insertCell(-1);
		td.className = "outputTableCell";
		td.appendChild(document.createTextNode(column))
	}
	for(var rowIndex in rows) {
		var row = rows[rowIndex];
		var tr = table.insertRow(-1);
		for(var column in row) {
			var td = tr.insertCell(-1);
			td.className = "outputTableCell";
			td.appendChild(document.createTextNode(row[column]))
		}
	}
	consoleDiv.innerHTML = "";
	consoleDiv.appendChild(table);
}
function displayTextEditor(x, y, text, textDiv) {
	var textEditor = document.getElementById("textEditor");
	var textEditorInput = document.getElementById("textEditorInput");
	var textEditorDone = document.getElementById("textEditorDone");
	textEditor.style.display = "block";
	textEditor.style.top = "" + y + "px";
	textEditor.style.left = "" + x + "px";
	textEditorInput.value = text;
	textEditor.textDiv = textDiv;
	textEditorInput.focus(); 

	textEditorDone.onclick = function() {
		var textEditor = document.getElementById("textEditor");
		var textEditorInput = document.getElementById("textEditorInput");
		textEditor.textDiv.textContent = textEditorInput.value;
		textEditor.style.display = "none";
	}
}

function createOperator(src, parent) {
	var operator = document.createElement('div');
	operator.innerHTML = "<img src="+src+"></img>";
	operator.className = "queryEditorOperator";

	operator.theParent = parent;

	operator.onclick = function(e) {
		if(currentBlock != null) {
			currentBlock.deselect();
		}
		currentBlock = this.theParent;
		currentParent = this.theParent.theParent;
		this.theParent.leftParenthesis.className = "queryEditorParenthesisSelected";
		this.theParent.rightParenthesis.className = "queryEditorParenthesisSelected";
		this.theParent.leftParenthesis.innerHTML = "[";
		this.theParent.rightParenthesis.innerHTML = "]";
		
		e.cancelBubble = true;
	}
	return operator;
}

function createRelation(text, parent) {
	var relation = document.createElement('div');
	relation.isLeaf = true;
	relation.className = "queryEditorRelation";
	var relationText = document.createElement('div');
	relationText.innerHTML = text;
	relationText.className = "queryEditorRelationText";

	relation.theParent = parent;
	relation.leafText = relationText;
	relation.leftParenthesis = createParenthesis(relation, "left");
	relation.rightParenthesis = createParenthesis(relation, "right");

	relation.appendChild(relation.leftParenthesis);
	relation.appendChild(relation.leafText);
	relation.appendChild(relation.rightParenthesis);
	relation.toSQL = function() {
		return this.leafText.textContent;
	}

	relation.onclick = function(e) {
		if(currentBlock != null) {
			currentBlock.deselect();
		}
		displayTextEditor(e.pageX, e.pageY, this.leafText.textContent, relationText)
		currentBlock = this;
		currentParent = this.theParent;

		e.cancelBubble = true;
	}
	relation.deselect = function() {
		this.leftParenthesis.className = "queryEditorParenthesis";
		this.rightParenthesis.className = "queryEditorParenthesis";
		this.leftParenthesis.innerHTML = "(";
		this.rightParenthesis.innerHTML = ")";
	}
	return relation;
}

function createCondition(text, parent) {
	var condition = document.createElement('div');
	condition.innerHTML = text;
	condition.className = "queryEditorCondition";
	condition.isLeaf = true;
	condition.theParent = parent;
	condition.toSQL = function() {
		return this.textContent;
	}

	condition.onclick = function(e) {
		if(currentBlock != null) {
			currentBlock.deselect();
		}
		displayTextEditor(e.pageX, e.pageY, this.textContent, this)

		e.cancelBubble = true;
	}
	condition.deselect = function() {
		this.leftParenthesis.className = "queryEditorParenthesis";
		this.rightParenthesis.className = "queryEditorParenthesis";
		this.leftParenthesis.innerHTML = "(";
		this.rightParenthesis.innerHTML = ")";
	}

	return condition;
}

function createParenthesis(child, orientation) {
	var parenthesis = document.createElement('div');
	parenthesis.className = "queryEditorParenthesis";
	
	if(orientation == "left") {
		parenthesis.innerHTML = "(";
	} 
	else if(orientation == "right") {
		parenthesis.innerHTML = ")";
	}
	else {
		return null
	}
	parenthesis.child = child;

	parenthesis.onclick = function(e) {
		if(currentBlock != null) {
			currentBlock.deselect();
		}
		currentBlock = this.child;
		currentParent = this.child.theParent;
		this.child.leftParenthesis.className = "queryEditorParenthesisSelected";
		this.child.rightParenthesis.className = "queryEditorParenthesisSelected";
		this.child.leftParenthesis.innerHTML = "[";
		this.child.rightParenthesis.innerHTML = "]";
		
		e.cancelBubble = true;
	}
	return parenthesis;
}
function addRelation() {
	var relation = createRelation("Relation", currentParent);
	currentParent.replaceChild(relation, currentBlock);

	currentBlock = null;
	currentParent = null;
}
function addOperatorConditionRelation(operator, toSQL, conditionName) {
	var expression = document.createElement('div');
	expression.className = "queryEditorExpression";
	expression.operator = createOperator(operator, expression);
	if(conditionName != undefined) {
		expression.condition = createCondition(conditionName);
	}
	else {
		expression.condition = createCondition("condition", expression);
	}
	expression.relation = createRelation("Relation", expression);
	expression.leftParenthesis = createParenthesis(expression, "left");
	expression.rightParenthesis = createParenthesis(expression, "right");

	expression.appendChild(expression.leftParenthesis);
	expression.appendChild(expression.operator);
	expression.appendChild(expression.condition);
	expression.appendChild(expression.relation);
	expression.appendChild(expression.rightParenthesis);

	expression.theParent = currentParent;

	expression.toSQL = toSQL;

	expression.deselect = function() {
		this.leftParenthesis.className = "queryEditorParenthesis";
		this.rightParenthesis.className = "queryEditorParenthesis";
		this.leftParenthesis.innerHTML = "(";
		this.rightParenthesis.innerHTML = ")";
	}
	currentParent.replaceChild(expression, currentBlock);

	currentBlock = null;
	currentParent = null;
}
function addRelationOperatorRelation(operator, toSQL) {
	var expression = document.createElement('div');
	expression.className = "queryEditorExpression";
	expression.operator = createOperator(operator, expression);
	expression.relation1 = createRelation("Relation1", expression);
	expression.relation2 = createRelation("Relation2", expression);
	expression.leftParenthesis = createParenthesis(expression, "left");
	expression.rightParenthesis = createParenthesis(expression, "right");

	expression.appendChild(expression.leftParenthesis);
	expression.appendChild(expression.relation1);
	expression.appendChild(expression.operator);
	expression.appendChild(expression.relation2);
	expression.appendChild(expression.rightParenthesis);

	expression.theParent = currentParent;
	expression.toSQL = toSQL;

	expression.deselect = function() {
		this.leftParenthesis.className = "queryEditorParenthesis";
		this.rightParenthesis.className = "queryEditorParenthesis";
		this.leftParenthesis.innerHTML = "(";
		this.rightParenthesis.innerHTML = ")";
	}
	currentParent.replaceChild(expression, currentBlock);

	currentBlock = null;
	currentParent = null;
}
function addRelationOperatorConditionRelation(operator, toSQL) {
	var expression = document.createElement('div');
	expression.className = "queryEditorExpression";
	expression.operator = createOperator(operator, expression);
	expression.relation1 = createRelation("Relation1", expression);
	expression.relation2 = createRelation("Relation2", expression);
	expression.condition = createCondition("condition", expression);
	expression.leftParenthesis = createParenthesis(expression, "left");
	expression.rightParenthesis = createParenthesis(expression, "right");

	expression.appendChild(expression.leftParenthesis);
	expression.appendChild(expression.relation1);
	expression.appendChild(expression.operator);
	expression.appendChild(expression.condition);
	expression.appendChild(expression.relation2);
	expression.appendChild(expression.rightParenthesis);

	expression.theParent = currentParent;
	expression.toSQL = toSQL;

	expression.deselect = function() {
		this.leftParenthesis.className = "queryEditorParenthesis";
		this.rightParenthesis.className = "queryEditorParenthesis";
		this.leftParenthesis.innerHTML = "(";
		this.rightParenthesis.innerHTML = ")";
	}
	currentParent.replaceChild(expression, currentBlock);

	currentBlock = null;
	currentParent = null;
}

function selectToSQL() {
	return "(SELECT * FROM " + this.children[3].toSQL() + " WHERE " + 
		this.children[2].toSQL()+")";
}
function projectToSQL() {
	return "(SELECT DISTINCT " + this.children[2].toSQL() + " FROM " + 
		this.children[3].toSQL()+")";
}
function unionToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " UNION SELECT * FROM " + 
		this.children[3].toSQL()+")";
}
function intersectToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " INTERSECT SELECT * FROM " + 
		this.children[3].toSQL()+")";
}
function crossToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " JOIN " + 
		this.children[3].toSQL()+")";
}
function subtractToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " EXCEPT SELECT * FROM " + 
		this.children[3].toSQL()+")";
}
function joinToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " NATURAL JOIN " + 
		this.children[3].toSQL()+")";
}
function thetaJoinToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " JOIN " + 
		this.children[4].toSQL() + " ON " + this.children[3].toSQL() +")";
}
function fullOuterJoinToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " NATURAL OUTER JOIN " + 
		this.children[3].toSQL()+")";
}
function thetaOuterJoinToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " OUTER JOIN " + 
		this.children[4].toSQL() + " ON " + this.children[3].toSQL() +")";
}
function rightOuterJoinToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " NATURAL RIGHT JOIN " + 
		this.children[3].toSQL()+")";
}
function thetaRightOuterJoinToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " RIGHT JOIN " + 
		this.children[4].toSQL() + " ON " + this.children[3].toSQL() +")";
}
function leftOuterJoinToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " NATURAL LEFT JOIN " + 
		this.children[3].toSQL()+")";
}
function thetaLeftOuterJoinToSQL() {
	return "(SELECT * FROM " + this.children[1].toSQL() + " LEFT JOIN " + 
		this.children[4].toSQL() + " ON " + this.children[3].toSQL() +")";
}
function assignToSQL() {
	return "(CREATE TABLE " + this.children[1].toSQL() + " AS SELECT * FROM " + 
		this.children[3].toSQL()+")";
}
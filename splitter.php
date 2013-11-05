<?php
$inputText = $_POST['processText'];
$sentenceArray = array();
$splitter = '/(?<=[.!?]|[.!?][\'"])\s+/';
$paragraphArray = explode("\n", $inputText);
for ($i=0; $i < count($paragraphArray); $i++)
  {
	$sentences = array();
	$sentences = preg_split($splitter, $paragraphArray[$i], -1, PREG_SPLIT_NO_EMPTY);
	$sentenceArray[$i] = $sentences;
  }  
echo json_encode($sentenceArray); 
?>
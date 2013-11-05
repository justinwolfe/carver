<?php
$inputText = $_POST['processText'];
$currentParagraphArray = array();
$splitter = '/(?<=[.!?]|[.!?][\'"])\s+/';
$currentParagraphArray = preg_split($splitter, $inputText, -1, PREG_SPLIT_NO_EMPTY);
echo json_encode($currentParagraphArray); 
?>
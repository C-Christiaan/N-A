<?php
class GameOfLife{
    private $width;
    private $height;
    private $grid;
    public function __construct($width, $height){
        $this->width = $width;
        $this->height = $height;
        $this->grid = array();
        for ($i = 0; $i < $height; $i++) { 
            $this->grid[$i] = array(); //this creates a new array (inside the array i hope) with the width
            for ($j = 0; $j < $width; $j++) {
                if (rand(1, 10) == 5) {
                    $Cell_Status = "A"; //cell is alive
                } else {
                    $Cell_Status = "D"; //cell is dead
                }
                $this->grid[$i][$j] = $Cell_Status; //this inserts a value into the previously made array
            }
            echo PHP_EOL;
        }
    }
}
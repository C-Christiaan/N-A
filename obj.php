<?php
class GameOfLife{
    //names the variables to later use
    private $width;
    private $height;
    private $grid;

    // when you call the function game of life  __construct is instatntly called so you dont need to
    public function __construct($width, $height){
        $this->width = $width;
        $this->height = $height;
        $this->grid = array();
        for ($i = 0; $i < $height; $i++) { 
            $this->grid[$i] = array(); //this creates a new array with the width
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
    public function PrintGrid() {
        foreach ($this->grid as $row) {
            foreach ($row as $cell) {
                echo $cell . ' '; // Print each cell with a space for readability
            }
            echo PHP_EOL;
        }
    }
}
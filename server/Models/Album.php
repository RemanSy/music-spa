<?php

namespace app\server\models;
use app\server\Model;

class Album extends Model {
    protected string $table = 'albums';

    public function __construct() {
        parent::__construct();
    }
}
<?php

namespace app\server\models;
use app\server\Model;

class Group extends Model {
    protected string $table = 'groups';

    public function __construct() {
        parent::__construct();
    }
}
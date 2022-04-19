<?php

namespace app\server\models;
use app\server\Model;

class User extends Model {
    protected string $table = 'users';

    public function __construct() {
        parent::__construct();
    }

    public function auth() {
        $res = $this->db->query("SELECT * FROM `users` WHERE `email` = '{$this->email}' AND `password` = '{$this->password}'");
        return count($res);
    }
}
<?php

namespace app\server;

class Database {
    public function __construct() {
        try {
            $this->pdo = new \PDO('mysql:host=localhost;dbname=zvuk', 'root', '');
            $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo $e->getMessage();
            exit;
        }
    }

    public function prepare($sql) {
        return $this->pdo->prepare($sql);
    }

    public function fetch($query, $fetch_mode = \PDO::FETCH_ASSOC) {
        $result = [];

        if ($fetch_mode != \PDO::FETCH_ASSOC && $fetch_mode != \PDO::FETCH_BOTH)
            throw new \Exception("Fetch mode doesn't support");

        $query->execute();

        while ($row = $query->fetch($fetch_mode))
            array_push($result, $row);

        return $result;
    }

    public function query($sql) {
        return $this->fetch($this->prepare($sql));
    }

    public function select($sql, $params) {
        $query = $this->db->prepare($sql);

        if ($this->_isAssoc($params)) {
            foreach ($params as $key => $val) {
                $key = (strpos($key, ':') !== false) ? $key : ":{$key}";
                $query->bindParam($key, $val);
            }
        } else {
            if (!strpos($sql, '?')) throw new \Exception("Invalid parameter binding, should '?' be used");

            foreach ($params as $key => $val)
                $query->bindParam($key + 1, $val);
        }

        return $this->db->fetch($query);
    }
}
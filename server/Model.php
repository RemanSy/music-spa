<?php

namespace app\server;

class Model {
    public function __construct() {
        $this->db = new Database();
        $this->fields = $this->getFields();

        foreach ($this->fields as $key => $val) {
            $this->$key = '';
        }

        if (!isset($this->table))
            $this->table = strtolower(array_pop(explode('\\', get_called_class())));
            
        if (!isset($this->primary_key))
            $this->primary_key = $this->db->query("show columns from `tracks` where `Key` = 'PRI'")[0]['Field'];
    }

    public function where($val1, $op, $val2) {
        if (!array_key_exists($val1, $this->fields)) throw new \Exception('Field doesn\'t exist');
        if ($op != '<' && $op != '<=' && $op != '=' && $op != '>' && $op != '>=') throw new \Exception("Incorrect operation");
        
        $sql = "SELECT * FROM `{$this->table}` WHERE `{$val1}` {$op} '{$val2}'";
        
        return $this->db->query($sql);
    }

    public function selectSingle($id) {
        return $this->where($this->primary_key, '=', $id);
    }

    public function get() {
        $sql = "SELECT * FROM `{$this->table}`";
        
        return $this->db->query($sql);
    }

    public function save() {
        $placeholders = [];

        foreach ($this->fields as $key => $fType) {
            if ($fType == 'timestamp' || $fType == 'datetime')
                $this->$key = date("Y-m-d H:i:s");
            else if ($this->$key == '')
                $this->$key = 'NULL';
            else
                $this->$key = htmlspecialchars(strip_tags(trim($this->$key)));

            $placeholders[$key] = ":{$key}";
        }
        
        $p = implode(', ', $placeholders);

        $sql = "INSERT INTO `{$this->table}` VALUES ($p)";

        $query = $this->db->prepare($sql);

        foreach ($placeholders as $key => $val) {
            if ($this->$key == 'NULL')
                $query->bindParam($val, $this->$key, \PDO::PARAM_NULL);
            else
                $query->bindParam($val, $this->$key);
        }
        
        return $query->execute() ?? false;
    }

    public function update($id, $data) {
        $dn = [];
        foreach($data as $key => $val)
            array_push($dn, "`{$key}` = '{$val}'");

        $dn = implode(', ', $dn);
        $sql = "UPDATE {$this->table} SET {$dn} WHERE `{$this->primary_key}` = {$id}";
        
        return $this->db->query($sql);
    }

    public function delete($id) {
        $sql = "DELETE FROM `{$this->table}` WHERE `{$this->primary_key}` = {$id}";
        
        return $this->db->query($sql);
    }

    public function uploadFile($file) {
        $fileName = $file['name'];
        $tmp_name = $file['tmp_name'];
        $uploading_dir = './uploads/';
        $fileExt = array_pop(explode('.', $fileName));
        
        $allowed_ext = ['mp3', 'ogg', 'aac', 'flac', 'jpeg', 'jpg'];

        if (!in_array($fileExt, $allowed_ext)) throw new \Exception('Unsupported file extension');

        $fNameNew = md5(time() . '!' . $fileName) . '.' . $fileExt;

        if (!move_uploaded_file($tmp_name, $uploading_dir . $fNameNew)) throw new \Exception('Uploading error');

        return $fNameNew;
    }

    public function getFields() {
        $sql = "SELECT `COLUMN_NAME`, `DATA_TYPE` FROM `INFORMATION_SCHEMA`.columns WHERE `TABLE_NAME` = '{$this->table}' AND `TABLE_SCHEMA` = 'zvuk'";
        $fields = [];
        
        foreach($this->db->query($sql) as $val) $fields[$val['COLUMN_NAME']] = $val['DATA_TYPE'];
        
        return $fields;
    }

    public function lastInsertId() {
        return $this->db->pdo->lastInsertId();
    }

    private function _isAssoc($arr) {        
        if (array_keys($arr) !== range(0, count($arr) - 1))
            return true;

        return false;
    }
}
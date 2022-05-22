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

        if (count($res) == 1)
            $this->update($res[0]['user_id'], ['token']);

        
        $this->response->setCookie('role', 1, time() + 7200);
        
        echo count($res);
    }

    public function getFavGroups() {
        $id = $this->getPKValue();
        $groups = $this->db->query("SELECT `group_id` FROM `users_relations` WHERE `user_id` = {$id} AND `group_id` IS NOT NULL");
        $ids = '';

        foreach($groups as $group)
            $ids .= $group['group_id'] . ',';
        
        $ids = substr($ids, 0, -1);

        if (!$ids) return 0;

        $groups = $this->db->query("SELECT `group_id`, `title` FROM `groups` WHERE `groups`.`group_id` IN ({$ids})");

        foreach ($groups as &$group) {
            $group['albums'] = $this->db->query("SELECT `album_id`, `title`, `genres`.`name` as `genre` 
            FROM `albums` 
                JOIN `genres` ON `genres`.`genre_id` = `albums`.`genre` 
            WHERE `albums`.`_group` = {$group['group_id']}");
        }
        

        return $groups;
    }

    public function getFavAlbums() {
        $id = $this->getPKValue();
        $groups = $this->db->query("SELECT `album_id` FROM `users_relations` WHERE `user_id` = {$id} AND `album_id` IS NOT NULL");
        $ids = '';

        foreach($groups as $group)
            $ids .= $group['album_id'] . ',';
        
        $ids = substr($ids, 0, -1);
        
        if (!$ids) return 0;
        $data = $this->db->query("SELECT `group_id`, `album_id`, `albums`.`title`, `groups`.`title` as `group`, `genres`.`name` as `genre`, `year`, `albums`.`image`, `albums`.`created_at`, `albums`.`updated_at` 
            FROM `albums` 
                JOIN `groups` 
                    ON `albums`.`_group` = `groups`.`group_id` 
                JOIN `genres` 
                    ON `albums`.`genre` = `genres`.`genre_id`
            WHERE `albums`.`album_id` IN ({$ids})");
        
        return $data;
    }

    public function getFavTracks() {
        $id = $this->getPKValue();
        $groups = $this->db->query("SELECT `track_id` FROM `users_relations` WHERE `user_id` = {$id} AND `track_id` IS NOT NULL");
        $ids = '';

        foreach($groups as $group)
            $ids .= $group['track_id'] . ',';
        
        $ids = substr($ids, 0, -1);
        
        if (!$ids) return 0;

        $data = $this->db->query("SELECT 
        `tracks`.`title`, `groups`.`title` as `group`, `albums`.`title` as `album`, `duration`, `albums`.`image` as `cover`, `location` 
        FROM `tracks` 
            JOIN `albums` 
                ON `tracks`.`album` = `albums`.`album_id` 
            JOIN `groups` 
                ON `tracks`.`_group` = `groups`.`group_id`
        WHERE `tracks`.`track_id` in ({$ids})");

        return $data;
    }
}
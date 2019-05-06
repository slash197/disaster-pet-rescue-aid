<?php
/* 
 * Author: Slash Web Design
 */

class API
{
	public $db = null;
	public $input = null;
	public $auth = null;
	
	function __construct()
	{
		global $db;

		$this->input = new Input();
		$this->db = $db;
		$this->auth = new Auth($this->input);
		
		if (!isset($this->input->method))
		{
			$this->respond(array('status' => false, 'error' => '[1004] API method not defined'));
		}
		
		if (!method_exists($this, $this->input->method))
		{
			$this->respond(array('status' => false, 'error' => '[1003] API method not valid'));
		}
	}
	
	public function signIn()
	{
		$this->respond($this->auth->signIn());
	}
	
	public function signUp()
	{
		$this->respond($this->auth->signUp());
	}

	public function access()
	{
		$this->respond(array(
			'status'	=>	true,
			'result'	=>	$this->db->run($this->input->q)
		));
	}
	
	public function create()
	{
		if (!$this->input->has(array('endpoint', 'data')))
		{
			$this->respond(array('status' => false, 'error' => '[1002] Input paramters not defined'));
		}
		
		$this->db->insert($this->input->endpoint, $this->input->data);

		$this->respond(array(
			'status'	=>	true,
			'id'		=>	(int) $this->db->lastInsertId()
		));
	}
	
	public function update()
	{
		if (!$this->input->has(array('endpoint', 'data', 'id')))
		{
			$this->respond(array('status' => false, 'error' => '[1002] Input paramters not defined'));
		}
		
		$this->db->update($this->input->endpoint, $this->input->data, "{$this->input->endpoint}_id = {$this->input->id}");

		$this->respond(array(
			'status'	=>	true,
			'id'		=>	(int) $this->input->id
		));
	}
	
	public function get()
	{
		if (!$this->input->has(array('endpoint', 'fields', 'filter')))
		{
			$this->respond(array('status' => false, 'error' => '[1002] Input paramters not defined'));
		}
		
		if (!isset($this->input->order)) $this->input->order = $this->input->endpoint . '_id ASC';
		if (!isset($this->input->limit)) $this->input->limit = 100;
		
		$res = $this->db->run("SELECT {$this->input->fields} FROM {$this->input->endpoint} WHERE {$this->input->filter} ORDER BY {$this->input->order} LIMIT {$this->input->limit}");

		$this->respond(array(
			'status'	=>	true,
			'data'		=>	$res
		));
	}
	
	public function delete()
	{
		if (!$this->input->has(array('endpoint', 'id')))
		{
			$this->respond(array('status' => false, 'error' => '[1002] Input paramters not defined'));
		}
		
		$this->db->run("DELETE FROM {$this->input->endpoint} WHERE {$this->input->endpoint}_id IN ({$this->input->id})");

		$this->respond(array(
			'status'	=>	true,
			'id'		=>	$this->input->id
		));
	}
	
	public function notFound()
	{
		$this->respond(array('status' => false, 'error' => '[1001] API endpoint not valid'));
	}
	
	public function respond($data, $contentType = 'application/json')
	{
		header("Content-type: {$contentType}; charset=utf-8;");
		
		switch ($contentType)
		{
			case 'text/html':
			case 'text/plain':
				echo $data;
				break;
				
			case 'application/json':
			default:
				echo json_encode($data);
		}
		
		die();
	}
}
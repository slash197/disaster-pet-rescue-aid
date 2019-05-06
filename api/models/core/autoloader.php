<?php 
/*
 * @Author: Slash Web Design
 */

class Autoloader 
{
    static public function loader($className)
	{
		$ds = DIRECTORY_SEPARATOR;
		
		$path = array(
			"models{$ds}core{$ds}",
			"models{$ds}",
			"../../models{$ds}core{$ds}",
			"../../models{$ds}",
		);
		
		foreach ($path as $p)
		{
			$file = str_replace("\\", DIRECTORY_SEPARATOR, $p . $className . ".php");
			$is = file_exists($file);
			$label = $is ? 'true' : 'false';
			
			if ($is)
			{
				require $file;
				$label = class_exists($className) ? 'true' : 'false';
				
	            if (class_exists($className) || interface_exists($className)) return true;
			}
			
			if (file_exists(strtolower($file)))
			{
				require strtolower($file);
	            if (class_exists($className) || interface_exists($className)) return true;
			}
		}
		
		echo "Unable to load object [ {$className} ]";
		die();
	}
}

spl_autoload_register('Autoloader::loader');
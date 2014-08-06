<?php

$scripts = array();
$images = array();

if ($handle = opendir('.')) {

    while (false !== ($entry = readdir($handle))) {

        if (
            $entry != "." 
            && $entry != ".." 
            && $entry != "listing-scripts.php" 
            && $entry != "preload-config.php" 
            && $entry != "index.php" 
            && !strpos($entry, ".sh")
            && !strpos($entry, ".txt")
            && substr($entry, strlen($entry) - 10, 4) != "2014"
        ) { 

            if(strpos($entry, "user.js")) {
                array_unshift($scripts, $entry);
            }
            else if(strpos($entry, ".jpg") 
                || strpos($entry, ".png") 
                || strpos($entry, ".gif") 
                || strpos($entry, ".jpeg")) {
                $images[] = $entry;
            }
            else {

                $scripts[] = $entry;
            }
        }
    }

    $scripts = array_merge($scripts, $images);
    closedir($handle);
}
?>
<h2>Liste des ressources</h2>

<ul style="font-family: sans-serif;" >
    <?php foreach ($scripts as $entry): ?>
        <li>
            <?php if(strpos($entry, "user.js")): ?>
                Script principal : <a class="main" href="<?php echo "$entry" . "?" . md5(uniqid(rand(), true)) . '.user.js'; ?>" ><?php echo "$entry"; ?></a><br/>
            <?php elseif(strpos($entry, ".jpg") 
                || strpos($entry, ".png") 
                || strpos($entry, ".gif") 
                || strpos($entry, ".jpeg")): ?>
                Image : <a class="image" href="<?php echo "$entry"; ?>" ><?php echo "$entry"; ?></a><br/>
            <?php else: ?>
               <a href="<?php echo "$entry"; ?>" ><?php echo "$entry"; ?></a><br/>
            <?php endif; ?>
        </li>
    <?php endforeach ?>
</ul>
<style>
    a {
        text-decoration: none;
        color: #36D;
    }
    a:hover {
        text-decoration: underline;
    }
    a.main {
        color: orange;
    }
    a.image {
        color: green;
    }
</style>
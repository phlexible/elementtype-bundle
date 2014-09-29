<?php
/**
 * phlexible
 *
 * @copyright 2007-2013 brainbits GmbH (http://www.brainbits.net)
 * @license   proprietary
 */

namespace Phlexible\Bundle\ElementtypeBundle\Model;

use Phlexible\Bundle\ElementtypeBundle\Entity\ElementtypeVersion;

/**
 * Elementtype version manager interface
 *
 * @author Stephan Wentz <sw@brainbits.net>
 */
interface ElementtypeVersionManagerInterface
{
    /**
     * @param Elementtype $elementtype
     * @param int         $version
     *
     * @return ElementtypeVersion
     */
    public function find(Elementtype $elementtype, $version = null);

    /**
     * @param Elementtype $elementtype
     *
     * @return array
     */
    public function getVersions(Elementtype $elementtype);

    /**
     * @param ElementtypeVersion $elementtypeVersion
     * @param bool               $flush
     */
    public function updateElementtypeVersion(ElementtypeVersion $elementtypeVersion, $flush = true);


    /**
     * @param ElementtypeVersion $elementtypeVersion
     * @param bool               $flush
     */
    public function deleteElementtypeVersion(ElementtypeVersion $elementtypeVersion, $flush = true);
}

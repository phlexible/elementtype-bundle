<?php
/**
 * phlexible
 *
 * @copyright 2007-2013 brainbits GmbH (http://www.brainbits.net)
 * @license   proprietary
 */

namespace Phlexible\Bundle\ElementtypeBundle\Model;

use Phlexible\Bundle\ElementtypeBundle\Entity\Elementtype;

/**
 * Elementtype manager interface
 *
 * @author Stephan Wentz <sw@brainbits.net>
 */
interface ElementtypeManagerInterface
{
    /**
     * Find element type by ID
     *
     * @param int $elementtypeId
     *
     * @return Elementtype
     */
    public function find($elementtypeId);

    /**
     * Find element type by unique ID
     *
     * @param string $uniqueID
     *
     * @return Elementtype
     */
    public function findOneByUniqueId($uniqueID);

    /**
     * Find element types by type
     *
     * @param string $type
     *
     * @return Elementtype[]
     */
    public function findByType($type);

    /**
     * Find all element types
     *
     * @return Elementtype[]
     */
    public function findAll();

    /**
     * Save element type
     *
     * @param Elementtype $elementtype
     * @param bool        $flush
     *
     * @return $this
     */
    public function updateElementtype(Elementtype $elementtype, $flush = true);

    /**
     * Delete an Element Type
     *
     * @param Elementtype $elementtype
     *
     * @return $this
     */
    public function deleteElementtype(Elementtype $elementtype);
}

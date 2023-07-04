@GetMapping(value = "/allVeryRare")
public ResponseEntity<Object> getAllVeryRareCards() {
	List<CardDTO> cards = cardService.getAllVeryRareCards().stream().map(mapper::cardToCardDTO).collect(Collectors.toList());
	return new ResponseEntity<>(cards, HttpStatus.OK);
}
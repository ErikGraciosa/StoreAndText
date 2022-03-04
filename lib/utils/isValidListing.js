const isValidListing = (listing) => {
  if(listing.link != null
    && listing.price != 0
    && Number(listing.price) < 2000
    && listing.address != ''
    && listing.bed < 3){
    return true;
  }
  return false;
}

module.exports = {
  isValidListing
}

import { Listing } from "../../../../data/listing.interface";

export interface ListingRowProps extends Listing {
  bold?: boolean;
  trailingIcon?: React.ReactNode;
  hasBg?: boolean;
}

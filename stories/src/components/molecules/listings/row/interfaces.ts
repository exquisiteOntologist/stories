import { Listing } from "../../../../data/listing.interface";

export interface ListingRowProps extends Listing {
  bold?: boolean;
  metaDetail?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  hasBg?: boolean;
}

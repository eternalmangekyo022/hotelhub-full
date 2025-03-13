type Props = {
  idx: number;
  amenity: Amenity;
};

export default function Amenity({ amenity, idx }: Props) {
  return (
    <li key={idx}>
      <span>
        <img src={`/vectors/${amenity.img}`} width="20" alt={amenity.img} />
      </span>
      {amenity.amenity}
    </li>
  );
}

import Image from "next/image";
import Link from "next/link";

interface RecordItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
  image_urls: string[];
}

export default function RecordCard({ record }: { record: RecordItem }) {
  const { id, title, content, created_at, image_urls } = record;
  const thumbnail = image_urls && image_urls.length > 0 ? image_urls[0] : null;

  return (
    <Link href={`/records/${id}`}>
      <div className="bg-[#0B0C2A] border border-[#FFD700]/20 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 group">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black/20 mb-3">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <Image
              src="/images/them/board.png"
              alt="기본 썸네일 이미지"
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>
        <h3 className="text-lg font-semibold text-white mb-1 truncate">
          {title}
        </h3>
        <p className="text-sm text-gray-300 line-clamp-2">{content}</p>
        <p className="text-xs text-gray-500 mt-2">
          {new Date(created_at).toLocaleDateString("ko-KR")}
        </p>
      </div>
    </Link>
  );
}

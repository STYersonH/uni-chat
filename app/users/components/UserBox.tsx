"use client";

import Avatar from "@/app/components/Avatar";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { use, useCallback, useState } from "react";
import { set } from "react-hook-form";

interface UserBoxProps {
	data: User;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
	const router = useRouter();
	const [isLoaded, setIsLoaded] = useState(false);

	const handleClick = useCallback(() => {
		setIsLoaded(true);

		axios
			.post("/api/conversations", {
				userId: data.id,
			})
			.then((data) => {
				router.push(`/conversations/${data.data.id}`);
			})
			.finally(() => setIsLoaded(false));
	}, [data, router]);

	return (
		<div
			className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
			onClick={handleClick}
		>
			<Avatar user={data} />
			{/* flex-1: el elemento div crece hasta ocupar todo el espacio disponible */}
			<div className="min-w-0 flex-1">
				<div className="focus:outline-none">
					<div className="flex justify-between items-center mb-1">
						<p className="text-sm font-medium text-gray-900">{data.name}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserBox;
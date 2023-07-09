"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";

interface ConversationListProps {
	initialItems: FullConversationType[];
	users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
	initialItems,
	users,
}) => {
	const [items, setItems] = useState(initialItems);
	// para abrir el modal de crear conversacion grupal
	const [isModalOpen, setIsModalOpen] = useState(false);

	const router = useRouter();

	const { conversationId, isOpen } = useConversation();

	return (
		<>
			<GroupChatModal
				users={users}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
			<aside
				className={clsx(
					`fixed inset-y-0 pb-20 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200`,
					isOpen ? "hidden" : "block w-full left-0"
				)}
			>
				<div className="px-5">
					<div className="flex justify-between mb-4 pt-4">
						<div className="text-2xl font-bold text-neutral-800">Messages</div>
						<div
							className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
							onClick={() => setIsModalOpen(true)}
						>
							<MdOutlineGroupAdd size={20} />
						</div>
					</div>
					{items.map((item) => (
						<ConversationBox
							key={item.id}
							data={item}
							selected={conversationId === item.id}
						/>
					))}
				</div>
			</aside>
		</>
	);
};

export default ConversationList;

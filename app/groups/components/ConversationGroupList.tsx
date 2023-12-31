"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdGroupAdd } from "react-icons/md";

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusherClient";
import { find, remove } from "lodash";
import ConversationBox from "@/app/components/chats/ConversationBox";

interface ConversationGroupListProps {
	initialItems: FullConversationType[];
	users: User[];
}

const ConversationGroupList: React.FC<ConversationGroupListProps> = ({
	initialItems,
	users,
}) => {
	const session = useSession();
	const [items, setItems] = useState(initialItems);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const router = useRouter();
	const { conversationGroupId, isOpenGroup } = useConversation();

	const pusherKey = useMemo(() => {
		return session.data?.user?.email;
	}, [session.data?.user?.email]);

	useEffect(() => {
		if (!pusherKey) return;

		pusherClient.subscribe(pusherKey);

		const newHandler = (conversation: FullConversationType) => {
			setItems((current) => {
				if (find(current, { id: conversation.id })) {
					return current;
				}

				return [conversation, ...current];
			});
		};

		const updateHandler = (conversation: FullConversationType) => {
			setItems((current) =>
				current.map((currentConversation) => {
					if (currentConversation.id === conversation.id) {
						return {
							...currentConversation,
							messages: conversation.messages,
						};
					}

					return currentConversation;
				})
			);
		};

		const removeHandler = (conversation: FullConversationType) => {
			setItems((current) => {
				// no debe ser igual al id que se recibio en el pusher
				return [...current.filter((convo) => convo.id !== conversation.id)];
			});

			// ya no mostrar los mensajes
			if (conversationGroupId === conversation.id) {
				router.push("/groups");
			}
		};

		pusherClient.bind("conversation:new", newHandler);
		pusherClient.bind("conversation:update", updateHandler);
		pusherClient.bind("conversation:remove", removeHandler);

		return () => {
			pusherClient.unsubscribe(pusherKey);
			pusherClient.unbind("conversation:new", newHandler);
			pusherClient.unbind("conversation:update", updateHandler);
			pusherClient.unbind("conversation:remove", removeHandler);
		};
	}, [pusherKey, conversationGroupId, router]);

	const handleGroupListFocus = async () => {
		try {
			const response = await fetch("/api/conversations");
			const data = await response.json();
			setItems(data);
		} catch (error) {
			console.error(error);
		}
	};

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
					isOpenGroup ? "hidden" : "block w-full left-0"
				)}
			>
				<div className="px-5" onFocus={handleGroupListFocus}>
					<div className="flex items-center justify-between mb-4 pt-4">
						<div className="text-2xl font-bold text-neutral-800">Groups</div>
						<div
							className="rounded-full p-2 text-gray-600 cursor-pointer hover:transform hover:scale-110 transition"
							onClick={() => setIsModalOpen(true)}
						>
							<MdGroupAdd className="text-black" size={25} />
						</div>
					</div>
					{items
						.filter((item) => item.isGroup) //restringir solo los chats que son de grupos
						.map((item) => (
							<ConversationBox
								key={item.id}
								data={item}
								selected={conversationGroupId === item.id}
							/>
						))}
				</div>
			</aside>
		</>
	);
};

export default ConversationGroupList;

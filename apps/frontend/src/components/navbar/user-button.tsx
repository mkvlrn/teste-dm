import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useAuth } from "#/utils/user";

export function UserButton() {
  const { user } = useAuth();

  return (
    <>
      {!user && <span />}
      {user?.email && (
        <UnstyledButton className="user-button">
          <Group>
            <Avatar
              radius="xl"
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
            />

            <div style={{ flex: 1 }}>
              <Text fw={500} size="sm">
                {user.name}
              </Text>

              <Text c="dimmed" size="xs">
                {user.email}
              </Text>
            </div>

            <IconChevronRight size={14} stroke={1.5} />
          </Group>
        </UnstyledButton>
      )}
    </>
  );
}

import { Stack } from "@mui/material";

import UserProfile from "../components/settings/UserProfile";
import GeneralSettings from "../components/settings/GeneralSettings";
import ModelSettings from "../components/settings/ModelSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import SecuritySettings from "../components/settings/SecuritySettings";

function Settings() {
  return (
    <Stack
      spacing={4}
      sx={{
        pb: 6,
      }}
    >
      <UserProfile />

      <GeneralSettings />

      <ModelSettings />

      <NotificationSettings />

      <SecuritySettings />
    </Stack>
  );
}

export default Settings;

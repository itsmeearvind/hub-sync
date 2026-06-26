import type { FC } from "react";
import { useEffect, useState } from "react";

import {
  Page,
  WixDesignSystemProvider,
  Card,
  Button,
  Text,
} from "@wix/design-system";

import "@wix/design-system/styles.global.css";

type Mapping = {
  wixField: string;
  hubspotProperty: string;
  direction: string;
};

const DashboardPage: FC = () => {
  const [connected, setConnected] = useState(false);
  const [portalId, setPortalId] = useState("");

  const [mappings, setMappings] = useState<Mapping[]>([
    {
      wixField: "firstName",
      hubspotProperty: "firstname",
      direction: "both",
    },
    {
      wixField: "lastName",
      hubspotProperty: "lastname",
      direction: "both",
    },
    {
      wixField: "email",
      hubspotProperty: "email",
      direction: "both",
    },
  ]);

  const handleConnect = () => {
    window.open("http://localhost:5001/api/hubspot/connect", "_blank");
  };

  const handleDisconnect = async () => {
    try {
      await fetch("http://localhost:5001/api/hubspot/disconnect", {
        method: "POST",
      });

      setConnected(false);
      setPortalId("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetch("http://localhost:5001/api/hubspot/status")
      .then((res) => res.json())
      .then((data) => {
        setConnected(data.connected);
        setPortalId(data.portalId || "");
      })
      .catch(console.error);
  }, []);

  const addMapping = () => {
    setMappings([
      ...mappings,
      {
        wixField: "",
        hubspotProperty: "",
        direction: "both",
      },
    ]);
  };

  const saveMappings = async () => {
    const hubspotFields = mappings.map((m) =>
      m.hubspotProperty.trim().toLowerCase(),
    );

    const duplicates = hubspotFields.filter(
      (item, index) => item && hubspotFields.indexOf(item) !== index,
    );

    if (duplicates.length > 0) {
      alert("Duplicate HubSpot Property Mapping Found");
      return;
    }

    await fetch("http://localhost:5001/api/mappings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mappings,
      }),
    });

    alert("Mappings Saved");
  };

  return (
    <WixDesignSystemProvider>
      <Page>
        <Page.Header
          title="HubSync"
          subtitle="Connect Wix Contacts with HubSpot CRM"
        />

        <Page.Content>
          <Card>
            <Card.Content>
              <div
                style={{
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}>
                {!connected ? (
                  <>
                    <Text>
                      Connect your HubSpot account to start syncing contacts,
                      leads and forms.
                    </Text>

                    <Button priority="primary" onClick={handleConnect}>
                      Connect HubSpot
                    </Button>
                  </>
                ) : (
                  <>
                    <Text>✅ HubSpot Connected</Text>

                    <Text>Portal ID: {portalId}</Text>

                    <Button priority="secondary" onClick={handleDisconnect}>
                      Disconnect HubSpot
                    </Button>

                    <hr />

                    <Text weight="bold">Field Mapping</Text>

                    {mappings.map((mapping, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "center",
                        }}>
                        <input
                          placeholder="Wix Field"
                          value={mapping.wixField}
                          onChange={(e) => {
                            const copy = [...mappings];
                            copy[index].wixField = e.target.value;
                            setMappings(copy);
                          }}
                        />

                        <input
                          placeholder="HubSpot Property"
                          value={mapping.hubspotProperty}
                          onChange={(e) => {
                            const copy = [...mappings];
                            copy[index].hubspotProperty = e.target.value;
                            setMappings(copy);
                          }}
                        />

                        <select
                          value={mapping.direction}
                          onChange={(e) => {
                            const copy = [...mappings];
                            copy[index].direction = e.target.value;
                            setMappings(copy);
                          }}>
                          <option value="wixToHubspot">Wix → HubSpot</option>

                          <option value="hubspotToWix">HubSpot → Wix</option>

                          <option value="both">Bi-Directional</option>
                        </select>
                      </div>
                    ))}

                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                      }}>
                      <Button onClick={addMapping}>Add Mapping</Button>

                      <Button priority="primary" onClick={saveMappings}>
                        Save Mapping
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card.Content>
          </Card>
        </Page.Content>
      </Page>
    </WixDesignSystemProvider>
  );
};

export default DashboardPage;

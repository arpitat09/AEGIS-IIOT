from config import ACTION_MAP


def get_prevention_action(severity):
    """
    Returns the prevention action based on severity.
    """

    action = ACTION_MAP.get(severity, "Alert")

    return {
        "severity": severity,
        "action": action
    }
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

import { TheTimer } from ".";

describe("TheTimer", () => {
  it("should display the start button", () => {
    const wrapper = render(TheTimer);
    const button = wrapper.getByRole("button", {
      description: /start/i,
    });

    expect(wrapper).toBeTruthy();
    expect(button).toBeTruthy();
  });

  it("should display the timer", async () => {
    const user = userEvent.setup();
    const wrapper = render(TheTimer);
    const button = wrapper.getByRole("button", {
      description: /start/i,
    });
    await user.click(button);
    const pomodoroText = wrapper.getByText(/pomodoro/i);
    const lastTimelineLabel = wrapper.getByTestId("timeline-label-25");

    expect(pomodoroText).toBeTruthy();
    expect(lastTimelineLabel).toBeTruthy();
  });
});

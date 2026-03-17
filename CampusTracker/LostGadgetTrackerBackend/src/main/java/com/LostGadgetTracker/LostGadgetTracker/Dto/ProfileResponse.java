package com.LostGadgetTracker.LostGadgetTracker.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {

    private String name;
    private String email;
    private String rollNoOrEmpId;
    private long lostCount;
    private long foundCount;

}